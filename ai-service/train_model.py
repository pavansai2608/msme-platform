import pandas as pd
from prophet import Prophet
import pickle
import os

print("Step 1 - Loading data...")
df = pd.read_csv('data/textile_production.csv')

# Convert year and month to a proper date column
month_map = {
    'April': '04', 'May': '05', 'June': '06',
    'July': '07', 'August': '08', 'September': '09',
    'October': '10', 'November': '11', 'December': '12',
    'January': '01', 'February': '02', 'March': '03'
}

# Create date from year and month
def get_date(row):
    year = str(row['year']).split('-')[0]
    month = month_map[row['month']]
    if row['month'] in ['January', 'February', 'March']:
        year = str(int(year) + 1)
    return f"{year}-{month}-01"

df['ds'] = df.apply(get_date, axis=1)
df['ds'] = pd.to_datetime(df['ds'])
df['y'] = df['index']
df = df[['ds', 'y']].sort_values('ds').reset_index(drop=True)

print(f"Step 2 - Data loaded. Total rows: {len(df)}")
print(df.head())

print("Step 3 - Loading Indian festivals...")
festivals = pd.read_csv('data/indian_festivals.csv')
festivals['ds'] = pd.to_datetime(festivals['date'])
festivals['holiday'] = festivals['festival_name']
festivals['lower_window'] = -festivals['days_before_spike']
festivals['upper_window'] = 2
holidays_df = festivals[['holiday', 'ds', 'lower_window', 'upper_window']]

print(f"Festivals loaded: {len(holidays_df)}")

print("Step 4 - Training Prophet model...")
model = Prophet(
    holidays=holidays_df,
    yearly_seasonality=True,
    weekly_seasonality=False,
    daily_seasonality=False,
    seasonality_mode='multiplicative'
)
model.fit(df)
print("Model trained successfully!")

print("Step 5 - Testing forecast for next 3 months...")
future = model.make_future_dataframe(periods=3, freq='MS')
forecast = model.predict(future)
print("\nNext 3 months forecast:")
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(3).to_string())

print("\nStep 6 - Saving model...")
os.makedirs('model', exist_ok=True)
with open('model/textile_model.pkl', 'wb') as f:
    pickle.dump(model, f)
print("Model saved to model/textile_model.pkl")
print("\nAll done! Model is ready.")

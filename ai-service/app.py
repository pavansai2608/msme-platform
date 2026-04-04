from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import os

app = Flask(__name__)
CORS(app)

# Load trained model
model = None
def load_model():
    global model
    model_path = 'model/textile_model.pkl'
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully")
    else:
        print("Model not found. Please run train_model.py first.")

load_model()

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'MSME AI Service is running'})

@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        data = request.json
        periods = data.get('periods', 3)
        future = model.make_future_dataframe(periods=periods, freq='MS')
        forecast = model.predict(future)
        result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
        result['ds'] = result['ds'].dt.strftime('%Y-%m')
        result['yhat'] = result['yhat'].round(2)
        result['yhat_lower'] = result['yhat_lower'].round(2)
        result['yhat_upper'] = result['yhat_upper'].round(2)
        return jsonify({
            'success': True,
            'forecast': result.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/insights', methods=['POST'])
def insights():
    try:
        data = request.json
        sales = data.get('sales_revenue', 0)
        inventory = data.get('inventory_qty', 0)
        cluster = data.get('cluster', 'Unknown')
        state = data.get('state', 'Unknown')
        insights_list = []
        if sales < 500000:
            insights_list.append("Your sales are below cluster average. Consider joining a bulk procurement group to reduce raw material costs by 15-20%.")
        else:
            insights_list.append("Your sales are strong. Explore export opportunities through AEPC to grow revenue by 25%.")
        if inventory > sales * 0.3:
            insights_list.append("Your inventory is high. Reduce raw material orders next month to avoid overstock losses.")
        else:
            insights_list.append("Stock up raw materials now — festive season demand spike expected in next 45 days.")
        insights_list.append(f"Check your eligibility for MUDRA loan and PMEGP scheme — MSMEs in {state} are getting up to Rs 10 lakh at low interest rates.")
        return jsonify({
            'success': True,
            'cluster': cluster,
            'state': state,
            'insights': insights_list
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/schemes', methods=['POST'])
def schemes():
    try:
        data = request.json
        turnover = data.get('annual_turnover', 0)
        size = data.get('enterprise_size', 'Micro')
        employees = data.get('employee_count', 0)
        schemes = []
        if turnover < 5000000:
            schemes.append({'name': 'MUDRA Shishu Loan', 'benefit': 'Up to Rs 50,000 at low interest'})
        if turnover < 10000000:
            schemes.append({'name': 'PMEGP', 'benefit': '15 to 35 percent capital subsidy'})
        if size == 'Micro':
            schemes.append({'name': 'PM Vishwakarma Yojana', 'benefit': 'Rs 15,000 toolkit and skill training'})
            schemes.append({'name': 'CLCSS', 'benefit': '15 percent subsidy on technology upgrade'})
        if employees < 50:
            schemes.append({'name': 'Udyam Registration Benefits', 'benefit': 'Priority lending and government tenders'})
        return jsonify({'success': True, 'eligible_schemes': schemes})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

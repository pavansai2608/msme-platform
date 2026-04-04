# India MSME Textile Platform

AI-Enabled Aggregation Platform for Indian Textile MSMEs

## Project Structure
- client/       - React frontend (3 dashboards)
- server/       - Node.js + Express backend
- ai-service/   - Python Flask AI service (Prophet forecasting)

## Setup Instructions

### Step 1 - Train AI Model
cd ai-service
pip install -r requirements.txt
python train_model.py

### Step 2 - Start Backend
cd server
npm install
node index.js

### Step 3 - Start Frontend
cd client
npm install
npm start

### Step 4 - Run with Docker
docker-compose up --build

## User Roles
- MSME Owner - sees forecast, insights, schemes
- Supplier    - sees demand, submits quotes
- Admin       - manages users, sees platform stats

## Datasets Used
- textile_production.csv  - AI model training (MOSPI IIP data)
- indian_festivals.csv    - Festive demand prediction
- msme_udyam.csv          - MSME registration data
- asi_survey.csv          - Industry survey data

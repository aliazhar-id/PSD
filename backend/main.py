from flask import Flask, request, jsonify
import pandas as pd
import pytz
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

CSV_FILE_PATH = "../dataset/dataset_bbca_5y.csv"
TICKER = "BBCA.JK"
YEARS = 5

def fetch_stock_data(TICKER, YEARS):
    five_years_ago = (datetime.now() - timedelta(days=YEARS * 365)).strftime("%Y-%m-%d")
    data = yf.download(TICKER, start=five_years_ago, progress=False)
    data.columns = [ columns[0].lower() for columns in data.columns ]
    data.index.name = data.index.name.lower()
    return data

def load_or_fetch_stock_data():
    if os.path.exists(CSV_FILE_PATH):
        data = pd.read_csv(CSV_FILE_PATH, parse_dates=["date"])
        last_date = data["date"].max()

        if last_date.tzinfo is None:
            last_date = pytz.UTC.localize(last_date)

        now = datetime.now(pytz.UTC)
        if last_date < now - timedelta(days=1):
            print("Data is outdated, fetching new data...")
            data = fetch_stock_data()
            data.to_csv(CSV_FILE_PATH)
    else:
        data = fetch_stock_data()
        data.to_csv(CSV_FILE_PATH)

    return data

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    data = load_or_fetch_stock_data()
    result = data.reset_index().to_dict(orient="records")

    return jsonify({"message": "Stock data fetched and saved successfully.", "data": result})

@app.route('/api/data', methods=['GET'])
def get_data():
    data = pd.read_csv(CSV_FILE_PATH, parse_dates=["date"])

    date_from = request.args.get('from')
    date_to = request.args.get('to')

    if not date_from or not date_to:
        return jsonify({"error": "Please provide 'from' and 'to' date parameters"}), 400

    try:
        tz = pytz.UTC
        date_from = pd.to_datetime(date_from).tz_localize(tz)
        date_to = pd.to_datetime(date_to).tz_localize(tz)
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    data['date'] = pd.to_datetime(data['date']).dt.tz_localize(tz, nonexistent='shift_forward')
    filtered_data = data[(data['date'] >= date_from) & (data['date'] <= date_to)]

    if date_from > date_to:
        return jsonify({"error": "'from' date must be earlier than or equal to 'to' date"}), 400

    if filtered_data.empty:
        return jsonify({"message": "No data found for the given date range"}), 404

    result = filtered_data.to_dict(orient="records")
    return jsonify({"message": "Stock data fetched", "data": result})

if __name__ == '__main__':
    app.run(debug=True)

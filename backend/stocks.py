import pandas as pd
import pytz
import yfinance as yf
from datetime import datetime, timedelta
import os

CSV_FILE_PATH = "../dataset/dataset_bbca_5y.csv"
TICKER = "BBCA.JK"
YEARS = 5
JAKARTA_TZ = pytz.timezone('Asia/Jakarta')

def fetch_stock_data(TICKER, YEARS):
    five_years_ago = (datetime.now(JAKARTA_TZ) - timedelta(days=YEARS * 365)).strftime("%Y-%m-%d")
    data = yf.download(TICKER, start=five_years_ago, progress=False)
    data.columns = [ columns[0].lower() for columns in data.columns ]
    data.index.name = data.index.name.lower()
    return data

def load_or_fetch_stock_data():
    if os.path.exists(CSV_FILE_PATH):
        data = pd.read_csv(CSV_FILE_PATH, parse_dates=["date"])
        data["date"] = pd.to_datetime(data["date"]).dt.tz_localize('Asia/Jakarta')
        last_date = data["date"].max()

        if data.empty or data['close'].isnull().all():
            print("Dataset is empty or missing critical columns, fetching new data...")
            data = fetch_stock_data(TICKER, YEARS)
            data.to_csv(CSV_FILE_PATH)
        else:
            if last_date.tzinfo is None:
                last_date = pytz.timezone('Asia/Jakarta').localize(last_date)

            now = datetime.now(JAKARTA_TZ)
            if last_date < now - timedelta(days=1):
                data = fetch_stock_data(TICKER, YEARS)
                data.to_csv(CSV_FILE_PATH)
    else:
        data = fetch_stock_data(TICKER, YEARS)
        data.to_csv(CSV_FILE_PATH)

    return data

def get_last_price():
    data = load_or_fetch_stock_data()
    
    now = datetime.now(JAKARTA_TZ)
    market_close_time = now.replace(hour=16, minute=0, second=0, microsecond=0)
    market_open_time = now.replace(hour=9, minute=30, second=0, microsecond=0)

    if market_open_time <= now < market_close_time:
        last_row = data.iloc[-2]
        prev_row = data.iloc[-3]
    else:
        last_row = data.iloc[-1]
        prev_row = data.iloc[-2]

    last_price = last_row['close']
    prev_price = prev_row['close']

    price_change = last_price - prev_price
    percentage_change = (price_change / prev_price) * 100
    percentage_change = round(percentage_change, 2)
    is_price_up = price_change > 0

    return {
        "last_price": last_price,
        "prev_price": prev_price,
        "price_change": price_change,
        "percentage_change": percentage_change,
        "isPriceUp": bool(is_price_up)
    }
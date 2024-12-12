import pandas as pd
import pytz
import yfinance as yf
from datetime import datetime, timedelta
import os

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
            data = fetch_stock_data(TICKER, YEARS)
            data.to_csv(CSV_FILE_PATH)
    else:
        data = fetch_stock_data(TICKER, YEARS)
        data.to_csv(CSV_FILE_PATH)

    return data

def get_last_price():
    data = load_or_fetch_stock_data()
    now = datetime.now(pytz.UTC)

    market_close_time = now.replace(hour=16, minute=0, second=0, microsecond=0)
    if now < market_close_time:
        print('tes')
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
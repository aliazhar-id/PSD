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
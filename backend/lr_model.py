from sklearn.linear_model import LinearRegression
import pandas as pd
from datetime import timedelta

def get_next_business_day(current_date):
    if current_date.weekday() == 4:
        return current_date + timedelta(days=3)
    elif current_date.weekday() == 5:
        return current_date + timedelta(days=2)
    elif current_date.weekday() == 6:
        return current_date + timedelta(days=1)
    else:
        return current_date + timedelta(days=1)

def preprocess(data):
    data['date'] = pd.to_datetime(data['date'])
    data.set_index('date', inplace=True)

    daily_data = data['close']
    if daily_data.isna().sum() > 0:
        print(f"Warning: {daily_data.isna().sum()} missing values found in daily data.")
        daily_data = daily_data.ffill()

    return daily_data

def predictions(df, last_date, days):
    current_date = get_next_business_day(last_date)

    df['Close_Lag1'] = df['close'].shift(1)
    df['Close_Lag2'] = df['close'].shift(2)
    df['Close_Lag3'] = df['close'].shift(3)
    df['Close_Lag4'] = df['close'].shift(4)
    df['Close_Lag5'] = df['close'].shift(5)

    df['Close_MA5'] = df['close'].rolling(window=5).mean()
    df['Close_MA10'] = df['close'].rolling(window=10).mean()
    df['Close_STD5'] = df['close'].rolling(window=5).std()

    df['Daily_Range'] = df['high'] - df['low']
    df.dropna(inplace=True)

    features = ['Close_Lag1', 'Close_Lag2', 'Close_Lag3', 'Close_Lag4', 'Close_Lag5',
            'Close_MA5', 'Close_MA10', 'Daily_Range', 'Close_STD5']

    X = df[features]
    y = df['close']

    model = LinearRegression()
    model.fit(X, y)

    last_row = df.iloc[-1][features]
    future_predictions = []

    for day in range(days):
        prediction = model.predict(last_row.values.reshape(1, -1))[0]
        future_predictions.append({
            "close": prediction,
            "date": current_date.strftime("%a, %d %b %Y %H:%M:%S GMT")
        })

        updated_features = last_row.copy()
        updated_features['Close_Lag5'] = updated_features['Close_Lag4']
        updated_features['Close_Lag3'] = updated_features['Close_Lag2']
        updated_features['Close_Lag2'] = updated_features['Close_Lag1']
        updated_features['Close_Lag1'] = prediction
        updated_features['Close_MA5'] = ((last_row['Close_MA5'] * 4) + prediction) / 5
        updated_features['Close_MA10'] = ((last_row['Close_MA10'] * 9) + prediction) / 10
        updated_features['Daily_Range'] = updated_features['Daily_Range']
        updated_features['Close_STD5'] = last_row['Close_STD5']

        last_row = updated_features
        current_date = get_next_business_day(current_date)
    
    return future_predictions

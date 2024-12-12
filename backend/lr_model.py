from sklearn.linear_model import LinearRegression
import pandas as pd

def predictions(df, days):
    # df.set_index('date', inplace=True)

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
        prediction_input = pd.DataFrame([last_row], columns=features)
        
        prediction = model.predict(prediction_input)[0]
        future_predictions.append(prediction)
        
        updated_features = last_row.copy()
        updated_features['Close_Lag5'] = updated_features['Close_Lag4']
        updated_features['Close_Lag4'] = updated_features['Close_Lag3']
        updated_features['Close_Lag3'] = updated_features['Close_Lag2']
        updated_features['Close_Lag2'] = updated_features['Close_Lag1']
        updated_features['Close_Lag1'] = prediction

        updated_features['Close_MA5'] = ((last_row['Close_MA5'] * 4) + prediction) / 5
        updated_features['Close_MA10'] = ((last_row['Close_MA10'] * 9) + prediction) / 10
        updated_features['Daily_Range'] = updated_features['Daily_Range']
        updated_features['Close_STD5'] = last_row['Close_STD5']

        last_row = updated_features

    now =  pd.Timestamp('now').normalize()
    future_workdays = pd.date_range(start=now, periods=days, freq='B').strftime('%Y-%m-%d').tolist()
    results = pd.DataFrame({"date": future_workdays, "close": future_predictions})

    return results
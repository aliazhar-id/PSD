from flask import Flask, request, jsonify
from flask_cors import CORS
from stocks import load_or_fetch_stock_data
from model import preprocess_daily_data, train_daily_model, predict_next_5_business_days, predict_next_4_weeks

app = Flask(__name__)
CORS(app)

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    data = load_or_fetch_stock_data()
    result = data.reset_index().to_dict(orient="records")

    return jsonify({"message": "Stock data fetched and saved successfully.", "data": result})

@app.route('/api/last_price', methods=['GET'])
def get_last_price():
    data = load_or_fetch_stock_data()

    last_row = data.iloc[-1]
    prev_row = data.iloc[-2]

    last_price = last_row['close']
    prev_price = prev_row['close']

    price_change = last_price - prev_price
    percentage_change = (price_change / prev_price) * 100
    percentage_change = round(percentage_change, 2)

    return jsonify({
        "message": "Last close fetched successfully",
        "data": {
            "last_price": last_price,
            "prev_price": prev_price,
            "price_change": price_change,
            "percentage_change": percentage_change
        }
    })

@app.route('/api/predict_weekly', methods=['GET'])
def predict_weekly():
    data = load_or_fetch_stock_data()
    daily_data = preprocess_daily_data(data)

    model = train_daily_model(daily_data)
    last_day_number = len(daily_data) - 1
    last_date = daily_data.index[-1]
    predicted_data = predict_next_5_business_days(model, last_day_number, last_date)

    return jsonify({"message": "Predict stock weekly", "data": predicted_data})

@app.route('/api/predict_monthly', methods=['GET'])
def predict_monthly():
    data = load_or_fetch_stock_data()
    daily_data = preprocess_daily_data(data)

    model = train_daily_model(daily_data)
    last_day_number = len(daily_data) - 1
    last_date = daily_data.index[-1]
    predicted_data = predict_next_4_weeks(model, last_day_number, last_date)

    return jsonify({"message": "Predict stock monthly", "data": predicted_data})

if __name__ == '__main__':
    app.run(debug=True)

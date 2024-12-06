from flask import Flask, request, jsonify
from flask_cors import CORS
from stocks import load_or_fetch_stock_data
from lr_model import preprocess, predictions

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

    last_row = data.iloc[-2]
    prev_row = data.iloc[-3]

    last_price = last_row['close']
    prev_price = prev_row['close']

    price_change = last_price - prev_price
    percentage_change = (price_change / prev_price) * 100
    percentage_change = round(percentage_change, 2)
    is_price_up = price_change > 0

    return jsonify({
        "message": "Last close fetched successfully",
        "data": {
            "last_price": last_price,
            "prev_price": prev_price,
            "price_change": price_change,
            "percentage_change": percentage_change,
            "isPriceUp": bool(is_price_up)
        }
    })

@app.route('/api/monthly_prediction', methods=['GET'])
def monthly():
    data = load_or_fetch_stock_data()
    daily_data = preprocess(data)
    last_date = daily_data.index[-1]
    result = predictions(data, last_date, 20)

    return jsonify({"message": "Predict stock monthly", "data": result})

@app.route('/api/weekly_prediction', methods=['GET'])
def weekly():
    data = load_or_fetch_stock_data()
    daily_data = preprocess(data)
    last_date = daily_data.index[-1]
    result = predictions(data, last_date, 5)

    return jsonify({"message": "Predict stock weekly", "data": result})

if __name__ == '__main__':
    app.run(debug=True)

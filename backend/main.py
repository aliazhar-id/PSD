from flask import Flask, jsonify
from flask_cors import CORS
from stocks import load_or_fetch_stock_data, get_last_price
from lr_model import predictions

app = Flask(__name__)
CORS(app)

@app.route('/api/last_price', methods=['GET'])
def last_price():
    last_price_data = get_last_price()
    return jsonify({
        "message": "Last close fetched successfully",
        "data": last_price_data
    })

@app.route('/api/weekly_prediction', methods=['GET'])
def weekly():
    data = load_or_fetch_stock_data()
    result = predictions(data, 6)
    result_json = result.to_dict(orient='records')

    return jsonify({"message": "Predict stock weekly", "data": result_json})

@app.route('/api/monthly_prediction', methods=['GET'])
def monthly():
    data = load_or_fetch_stock_data()
    result = predictions(data, 23)
    result_json = result.to_dict(orient='records')

    return jsonify({"message": "Predict stock monthly", "data": result_json})

@app.route('/api/stocks', methods=['GET'])
def stocks():
    data = load_or_fetch_stock_data()
    result = data.reset_index().to_dict(orient="records")
    
    return jsonify({
        "message": "Stocks data fetched successfully",
        "data": result
    })

if __name__ == '__main__':
    app.run(debug=True)

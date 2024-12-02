from flask import Flask, request, jsonify
import pandas as pd
import pytz

app = Flask(__name__)

# Load CSV into a pandas DataFrame
data = pd.read_csv("../dataset/dataset_bbca_5y.csv", parse_dates=["Date"])

# @app.route('/api/data', methods=['GET']
@app.route('/api/data', methods=['GET'])
def get_data():
    # Get query parameters
    date_from = request.args.get('from')
    date_to = request.args.get('to')

    # Validate dates
    if not date_from or not date_to:
        return jsonify({"error": "Please provide 'from' and 'to' date parameters"}), 400

    try:
        tz = pytz.UTC
        date_from = pd.to_datetime(date_from).tz_localize(tz)
        date_to = pd.to_datetime(date_to).tz_localize(tz)
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    # Filter data based on the date range
    filtered_data = data[(data['Date'] >= date_from) & (data['Date'] <= date_to)]

    if date_from > date_to:
        return jsonify({"error": "'from' date must be earlier than or equal to 'to' date"}), 400

    # Check if data exists
    if filtered_data.empty:
        return jsonify({"message": "No data found for the given date range"}), 404

    # Convert the filtered data to a list of dictionaries
    result = filtered_data.to_dict(orient="records")
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

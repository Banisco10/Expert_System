from flask import Flask, request, jsonify
import numpy as np
import rasterio
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Define the rule-based expert system functions
def vegetation_loss(data):
    return float(data.get('vegetation_index', 1)) < 0.4

def unauthorized_machinery(data):
    return data.get('unauthorized_machinery', False)

def high_water_turbidity(data):
    return float(data.get('water_turbidity', 0)) > 50

def detect_land_disturbance(image_path):
    try:
        with rasterio.open(image_path) as src:
            image = src.read(1)
            disturbed_area = np.sum(image > 200)
            return disturbed_area > 10000
    except Exception as e:
        print(f"Error processing image: {e}")
        return False

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Python backend!"})

@app.route('/check_illegal_mining', methods=['POST'])
def check_illegal_mining():
    data = request.json
    results = []

    if vegetation_loss(data):
        results.append("Significant vegetation loss detected. Possible illegal mining.")
    if unauthorized_machinery(data):
        results.append("Unauthorized machinery detected. Possible illegal mining.")
    if high_water_turbidity(data):
        results.append("High water turbidity detected. Possible illegal mining.")
    if detect_land_disturbance(data.get('satellite_image', '')):
        results.append("Large disturbed land detected in satellite imagery. Possible illegal mining.")

    if not results:
        results.append("No illegal mining detected.")

    return jsonify({"results": results})

if __name__ == '__main__':
    app.run(debug=True)

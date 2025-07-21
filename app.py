# app.py

import requests
from flask import Flask, render_template

from config import BOM_JSON_URL, OPEN_METEO_FORECAST_URL


app = Flask(__name__)

@app.route("/")
def dashboard():
    #forecast information
    forecast_data = {}
    try:
        response = requests.get(OPEN_METEO_FORECAST_URL, timeout=5)
        if response.status_code == 200:
            data = response.json()
            forecast_data = {
                "dates": data["daily"]["time"],
                "min_temps": data["daily"]["temperature_2m_min"],
                "max_temps": data["daily"]["temperature_2m_max"],
                "rainfall": data["daily"]["precipitation_sum"]
            }
    except Exception as e:
        print(f"Error fetching Open-Meteo forecast: {e}")
    
    # current observations
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        url = BOM_JSON_URL
        response = requests.get(url, headers=headers, timeout=5)
        print("Status Code:", response.status_code)
        print("Content Snippet:", response.text[:500])
        data = response.json()

        # Check if observations and data exist
        observations = data.get("observations", {})
        readings = observations.get("data", [])

        if readings:
            latest = readings[0]
            weather = {
                "location": latest.get("name", "N/A"),
                "temp": latest.get("air_temp", "N/A"),
                "humidity": latest.get("rel_hum", "N/A"),
                "summary": latest.get("weather", "N/A"),
                "windkmh": latest.get("wind_spd_kmh", "N/A"),
                "winddir": latest.get("wind_dir", "N/A"),
                "gustkmh": latest.get("gust_kmh", "N/A"),
                "pressure": latest.get("press", "N/A")
            }
        else:
            print("BoM JSON structure missing 'data'")
            weather = {"temp": "N/A", "humidity": "N/A", "summary": "Unavailable"}

    except Exception as e:
        print("BoM fetch error:", e)
        weather = {"temp": "N/A", "humidity": "N/A", "summary": "Unavailable"}

    indoor = {"temp": "N/A", "humidity": "N/A", "aqi": "N/A"}  # Placeholder for now

    return render_template("dashboard.html", weather=weather, indoor=indoor)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

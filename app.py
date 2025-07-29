# app.py

import requests
import json
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for

from config import LOCATION, COUNTRY, LAT, LONG, BOM_JSON_URL, OPEN_METEO_FORECAST_URL, load_config, save_config
from moon import get_moon_phase
from pressure import get_pressure_trend


app = Flask(__name__)

@app.route("/")
def dashboard():
    #general info
    general = {
        "location": LOCATION,
        "country": COUNTRY,
        "lat": LAT,
        "long": LONG,
        "bom_url": BOM_JSON_URL,
        "forecast_url": OPEN_METEO_FORECAST_URL,
        "date": datetime.now().strftime("%A, %d %B %Y"),  # e.g. Thursday, 25 July 2025
        "last_updated": datetime.now().strftime("%H:%M:%S"),
        
    }


    #forecast information
    forecast_data = {}
    try:
        response = requests.get(OPEN_METEO_FORECAST_URL, timeout=5)
        if response.status_code == 200:
            data = response.json()
            forecast_data = {
                "dates": [datetime.strptime(d, "%Y-%m-%d").strftime("%a") for d in data["daily"]["time"]],
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

            recent = [r for r in readings if r.get("press") is not None][:6]
            pressure_now = float(recent[0]["press"])
            pressure_5ago = float(recent[-1]["press"]) if len(recent) >= 6 else pressure_now
            pressure_trend = get_pressure_trend(readings)

            weather = {
                "station": latest.get("name", "N/A"),
                "temp": latest.get("air_temp", "N/A"),
                "humidity": latest.get("rel_hum", "N/A"),
                "apparent_t": latest.get("apparent_t", "N/A"),
                "summary": latest.get("weather", "N/A"),
                "windkmh": latest.get("wind_spd_kmh", "N/A"),
                "winddir": latest.get("wind_dir", "N/A"),
                "gustkmh": latest.get("gust_kmh", "N/A"),
                "pressure": pressure_now,
                "pressure_2h_ago": pressure_5ago,
                "pressure_trend": pressure_trend
            }

            last_24h_readings = [r for r in readings if r.get("press") is not None][:48]
            pressure_history = []
            for i, r in enumerate(last_24h_readings):
                current_pressure = float(r["press"])
                dt = datetime.strptime(r["local_date_time_full"], "%Y%m%d%H%M%S")
                timestamp = dt.strftime("%d-%b %H:%M")

                # Compare with previous reading to determine trend
                if i < len(last_24h_readings) - 1:
                    prev_pressure = float(last_24h_readings[i + 1]["press"])
                    if current_pressure > prev_pressure:
                        trend_icon = "⬆️"
                    elif current_pressure < prev_pressure:
                        trend_icon = "⬇️"
                    else:
                        trend_icon = "➡️"
                else:
                    trend_icon = "–"

                pressure_history.append({
                    "time": timestamp,
                    "value": f"{current_pressure:.1f}",
                    "trend_icon": trend_icon
                })


        else:
            print("BoM JSON structure missing 'data'")
            weather = {"temp": "N/A", "humidity": "N/A", "summary": "Unavailable"}

    except Exception as e:
        print("BoM fetch error:", e)
        weather = {"temp": "N/A", "humidity": "N/A", "summary": "Unavailable"}

    moon_phase = get_moon_phase()

    indoor = {"temp": "N/A", "humidity": "N/A", "aqi": "N/A"}  # Placeholder for now

    return render_template("dashboard.html", general=general, weather=weather, indoor=indoor, forecast=forecast_data, moon=moon_phase, pressure_history=pressure_history)

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    config = load_config()
    if request.method == 'POST':
        config['LOCATION'] = request.form['LOCATION']
        config['COUNTRY'] = request.form['COUNTRY']
        config['LAT'] = request.form['LAT']
        config['LONG'] = request.form['LONG']
        config['BOM_JSON_URL'] = request.form['BOM_JSON_URL']
        config['OPEN_METEO_FORECAST_URL'] = request.form['OPEN_METEO_FORECAST_URL']
        save_config(config)
        return redirect(url_for('settings'))
    return render_template('settings.html', config=config)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

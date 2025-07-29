# config.py

import json
import os

DEFAULT_LAT = -33.86
DEFAULT_LONG = 151.2

DEFAULT_LAT = -33.86
DEFAULT_LONG = 151.2

DEFAULT_CONFIG = {
    "LOCATION": "Sydney",
    "COUNTRY": "Australia",
    "LAT": DEFAULT_LAT,
    "LONG": DEFAULT_LONG,
    "BOM_JSON_URL": "http://www.bom.gov.au/fwo/IDN60901/IDN60901.94768.json",
    "OPEN_METEO_FORECAST_URL": (
        "https://api.open-meteo.com/v1/forecast?"
        "latitude={lat}&longitude={long}&daily=temperature_2m_min,temperature_2m_max,"
        "precipitation_sum&timezone=Australia%2FSydney"
    )
}

# Preferred location outside git repo
CONFIG_PATH = "/etc/weather-dashboard/config.json"

# Optional fallback for users without sudo:
USER_CONFIG_PATH = os.path.expanduser("~/.config/weather-dashboard/config.json")

def load_config():
    try:
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r") as f:
                return json.load(f)
        elif os.path.exists(USER_CONFIG_PATH):
            with open(USER_CONFIG_PATH, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"Warning: could not load config: {e}")
    
    return DEFAULT_CONFIG

def save_config(config):
    path = CONFIG_PATH if os.access(os.path.dirname(CONFIG_PATH), os.W_OK) else USER_CONFIG_PATH
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(config, f, indent=4)

config = load_config()

LOCATION = config["LOCATION"]
COUNTRY = config["COUNTRY"]
LAT = config["LAT"]
LONG = config["LONG"]
BOM_JSON_URL = config["BOM_JSON_URL"]

raw_url = config["OPEN_METEO_FORECAST_URL"]
try:
    OPEN_METEO_FORECAST_URL = raw_url.format(lat=LAT, long=LONG)
except:
    OPEN_METEO_FORECAST_URL = raw_url


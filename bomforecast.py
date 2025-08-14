# bomforecast.py

import re
import requests
from bs4 import BeautifulSoup

def get_bom_forecast(bomurl):
    forecasts = []
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(bomurl, headers=headers, timeout=5)
        response.raise_for_status()
        html = response.text
    except Exception as e:
        print(f"HTTP request failed: {e}. Falling back to local file.")
        html = load_fallback_html()
        if html is None:
            return {"issued": None, "daily": forecasts}

    try:
        soup = BeautifulSoup(html, "html.parser")
    except Exception as e:
        print(f"HTML parsing failed: {e}. Falling back to local file.")
        html = load_fallback_html()
        if html is None:
            return {"issued": None, "daily": forecasts}  # empty
        soup = BeautifulSoup(html, "html.parser")

    issued_span = soup.select_one(".forecasts-top h2 span")
    if issued_span:
        issued_at = issued_span.text.strip()
    else:
        issued_at = "Changed Structure"


    forecast_blocks = soup.select("dl.forecast-summary")
    if not forecast_blocks:
        print("No forecast blocks found. Falling back to local file.")
        html = load_fallback_html()
        if html:
            soup = BeautifulSoup(html, "html.parser")
            forecast_blocks = soup.select("dl.forecast-summary")
        if not forecast_blocks:
            return {"issued": issued_at, "daily": forecasts}

    for block in forecast_blocks:
        date_el = block.select_one("dt.date a")
        min_temp = block.select_one("dd.min")
        max_temp = block.select_one("dd.max")
        rain_chance = block.select_one("dd.pop")
        rain_amt = block.select_one("dd.amt")
        icon = block.select_one("dd.image img")

        day_text, date_text = "", ""
        if date_el:
            full_text = date_el.text.strip()
            # For example: "Fri 1 Aug" or "Rest of Thursday"
            parts = full_text.split(" ", 1)
            if len(parts) == 2 and parts[0].isalpha():
                day_text = parts[0]
                date_text = parts[1]
            else:
                # Handle cases like "Rest of Thursday"
                day_text = full_text
                date_text = ""

        forecasts.append({
            "day": day_text,
            "date": date_text,
            "min": strip_units(min_temp.text) if min_temp else "",
            "max": strip_units(max_temp.text) if max_temp else "",
            "rain_amt": strip_units(rain_amt.text) if rain_amt else "",
            "chance_of_rain": rain_chance.text.strip() if rain_chance else "",
            "icon_desc": icon["alt"] if icon else ""
        })


    return {"issued": issued_at, "daily": forecasts}

def strip_units(text):
            if not text:
                return ""
            return re.sub(r"[^\d\-–to ]", "", text).strip()

def load_fallback_html(path="static/html/sydney.html"):
    try:
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    except Exception as e:
        print(f"Failed to load fallback file: {e}")
        return None
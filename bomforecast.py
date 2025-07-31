import requests
from bs4 import BeautifulSoup

def get_bom_forecast(bomurl):
    forecasts = []
    headers = {"User-Agent": "Mozilla/5.0"}


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
            return forecasts  # empty

    try:
        soup = BeautifulSoup(html, "html.parser")
    except Exception as e:
        print(f"HTML parsing failed: {e}. Falling back to local file.")
        html = load_fallback_html()
        if html is None:
            return forecasts  # empty
        soup = BeautifulSoup(html, "html.parser")


    forecast_blocks = soup.select("dl.forecast-summary")
    if not forecast_blocks:
        print("No forecast blocks found. Falling back to local file.")
        html = load_fallback_html()
        if html:
            soup = BeautifulSoup(html, "html.parser")
            forecast_blocks = soup.select("dl.forecast-summary")
        if not forecast_blocks:
            return forecasts  # empty

    for block in forecast_blocks:
        date = block.select_one("dt.date a")
        min_temp = block.select_one("dd.min")
        max_temp = block.select_one("dd.max")
        rain_chance = block.select_one("dd.pop")
        icon = block.select_one("dd.image img")

        forecasts.append({
                "date": date.text.strip() if date else "N/A",
                "min": min_temp.text.strip() if min_temp else "N/A",
                "max": max_temp.text.strip() if max_temp else "N/A",
                "chance_of_rain": rain_chance.text.strip() if rain_chance else "",
                "icon_desc": icon["alt"] if icon else ""
            })

    return forecasts;



def load_fallback_html(path="static/html/sydney.html"):
    try:
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    except Exception as e:
        print(f"Failed to load fallback file: {e}")
        return None
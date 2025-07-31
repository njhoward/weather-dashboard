import requests
from bs4 import BeautifulSoup

def get_bom_forcast(bomurl):
    forecasts = []

    headers = {"User-Agent": "Mozilla/5.0"}
    url = bomurl
    response = requests.get(url, headers=headers, timeout=5)
    soup = BeautifulSoup(response.text, "html.parser")

    for day in soup.select(".day"):
        date = day.select_one(".date").text.strip() if day.select_one(".date") else ""
        condition = day.select_one(".precis").text.strip() if day.select_one(".precis") else ""
        max_temp = day.select_one(".max").text.strip() if day.select_one(".max") else ""
        min_temp = day.select_one(".min").text.strip() if day.select_one(".min") else ""

        forecasts.append({
            "date": date,
            "condition": condition,
            "min": min_temp,
            "max": max_temp
        })

    return forecasts;
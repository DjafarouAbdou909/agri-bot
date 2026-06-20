import requests
from django.conf import settings

OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_weather_for_region(region: str) -> dict:
    params = {
        "q": f"{region},CI",
        "appid": settings.OPENWEATHER_API_KEY,
        "units": "metric",
        "lang": "fr",
    }

    try:
        response = requests.get(OPENWEATHER_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc:
        print(f"[weather.client] Échec récupération météo pour {region} : {exc}")
        return {}
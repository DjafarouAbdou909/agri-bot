from .client import get_weather_for_region

WELCOME_HEADER = "👋 Bienvenue sur AGRI-BOT !\n\n"


def build_welcome_message(farmer) -> str:
    weather_data = get_weather_for_region(farmer.region or "Abidjan")

    if not weather_data:
        return (
            WELCOME_HEADER
            + "Je suis ton assistant agricole. Envoie-moi une question, "
              "un message vocal, ou une photo de plante pour un diagnostic "
        )

    temp = weather_data.get("main", {}).get("temp")
    description = weather_data.get("weather", [{}])[0].get("description", "")
    rain_mm = weather_data.get("rain", {}).get("1h", 0)
    wind_speed = weather_data.get("wind", {}).get("speed", 0)

    advice = _climate_advice(temp, rain_mm, wind_speed)

    return (
        f"{WELCOME_HEADER}"
        f"📍 Météo actuelle à {farmer.region} : {temp:.0f}°C, {description}\n"
        f"{advice}\n\n"
        f"Envoie-moi une question, un message vocal, ou une photo de plante "
        f"pour un diagnostic. Tu peux aussi me dire ta culture (ex: \"je cultive du cacao\") "
        f"pour des conseils personnalisés "
    )


def _climate_advice(temp: float | None, rain_mm: float, wind_speed: float) -> str:
    if temp is None:
        return ""
    if rain_mm > 10:
        return " Fortes pluies en cours : surveille les risques de maladies fongiques sur tes cultures."
    if temp > 33:
        return " Forte chaleur : pense à irriguer si possible."
    if wind_speed > 15:
        return " Vents forts : protège les jeunes plants si besoin."
    return " Conditions climatiques stables aujourd'hui."
RAIN_THRESHOLD_MM = 10
HEAT_THRESHOLD_C = 33
WIND_THRESHOLD_MS = 15


def get_alert_message(weather_data: dict, crop: str) -> str | None:
    if not weather_data:
        return None

    rain_mm = weather_data.get("rain", {}).get("1h", 0)
    temp = weather_data.get("main", {}).get("temp", 0)
    wind_speed = weather_data.get("wind", {}).get("speed", 0)

    if rain_mm > RAIN_THRESHOLD_MM:
        return (
            f" Fortes pluies prévues. Risque accru de maladies fongiques "
            f"sur {crop}. Inspecte tes plants dans les prochains jours."
        )

    if temp > HEAT_THRESHOLD_C:
        return (
            f" Forte chaleur prévue ({temp:.0f}°C). "
            f"Pense à irriguer ton champ de {crop} si possible."
        )

    if wind_speed > WIND_THRESHOLD_MS:
        return (
            f" Vents forts annoncés. "
            f"Protège les jeunes plants de {crop} si tu le peux."
        )

    return None
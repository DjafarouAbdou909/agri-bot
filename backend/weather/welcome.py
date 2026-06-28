"""
Message de bienvenue lors du premier contact avec AGRI-BOT.
Bilingue par défaut (français + anglais) car on ne connaît pas encore
la langue préférée de l'agriculteur à ce stade.
"""
from .client import get_weather_for_region
from farmers.services import SUGGESTED_CITIES

WELCOME_NO_CITY = (
    "Bienvenue sur AGRI-BOT ! / Welcome to AGRI-BOT!\n\n"
    "🇫Pour te donner des conseils météo précis, dis-moi dans quelle "
    "ville tu te trouves.\n"
    "To give you accurate weather advice, tell me which city you're in.\n\n"
    "Exemples / Examples:\n"
    + "\n".join(f"• {city}" for city in SUGGESTED_CITIES) +
    "\n\nTu peux aussi me parler de ta culture, m'envoyer une photo de "
    "plante, ou un message vocal — en français ou en anglais\n"
    "You can also tell me your crop, send a plant photo, or a voice "
    "message — in French or English"
)


def build_welcome_message(farmer) -> str:
    return WELCOME_NO_CITY


def build_city_confirmation_message(farmer) -> str:
    """
    Reste en français par défaut à ce stade précis (la langue n'est pas
    encore détectée formellement) - le LLM prendra le relais en anglais
    dès le premier message de l'agriculteur dans cette langue.
    """
    weather_data = get_weather_for_region(farmer.region)

    if not weather_data:
        return (
            f"Ville enregistrée : {farmer.region}.\n"
            f"Je n'ai pas pu récupérer la météo pour le moment, mais "
            f"je m'en souviendrai pour la suite 🌱"
        )

    temp = weather_data.get("main", {}).get("temp")
    description = weather_data.get("weather", [{}])[0].get("description", "")
    rain_mm = weather_data.get("rain", {}).get("1h", 0)
    wind_speed = weather_data.get("wind", {}).get("speed", 0)
    advice = _climate_advice(temp, rain_mm, wind_speed)

    return (
        f"Ville enregistrée : {farmer.region}\n"
        f"Météo actuelle : {temp:.0f}°C, {description}\n"
        f"{advice}\n\n"
        f"Tu peux maintenant me poser tes questions, m'envoyer une photo "
        f"de plante, ou me dire ta culture 🌱"
    )


def _climate_advice(temp, rain_mm, wind_speed) -> str:
    if temp is None:
        return ""
    if rain_mm > 10:
        return "⚠️ Fortes pluies en cours : surveille les risques de maladies fongiques sur tes cultures."
    if temp > 33:
        return "☀️ Forte chaleur : pense à irriguer si possible."
    if wind_speed > 15:
        return "💨 Vents forts : protège les jeunes plants si besoin."
    return "🌤️ Conditions climatiques stables aujourd'hui."
"""
Message de bienvenue lors du premier contact avec AGRI-BOT.
Ne présume plus d'une ville par défaut : on propose une liste de
villes et on demande à l'agriculteur de choisir la sienne.
"""
from .client import get_weather_for_region
from farmers.services import SUGGESTED_CITIES

WELCOME_NO_CITY = (
    "Bienvenue sur AGRI-BOT !\n\n"
    "Je suis ton assistant agricole. Pour te donner des conseils météo "
    "précis, dis-moi d'abord dans quelle ville tu te trouves.\n\n"
    "Quelques exemples :\n"
    + "\n".join(f"• {city}" for city in SUGGESTED_CITIES) +
    "\n\n(Tu peux aussi écrire une autre ville de Côte d'Ivoire)\n\n"
    "Tu peux aussi déjà me parler de ta culture, m'envoyer une photo "
    "de plante, ou un message vocal "
)


def build_welcome_message(farmer) -> str:
    """
    Message envoyé au tout premier contact. Ne donne PAS de météo
    automatiquement - propose une liste de villes et demande de choisir.
    """
    return WELCOME_NO_CITY


def build_city_confirmation_message(farmer) -> str:
    """
    Message envoyé dès que la ville de l'agriculteur est détectée pour
    la première fois - confirme la ville et donne la météo actuelle.
    """
    weather_data = get_weather_for_region(farmer.region)

    if not weather_data:
        return (
            f" Ville enregistrée : {farmer.region}.\n"
            f"Je n'ai pas pu récupérer la météo pour le moment, mais "
            f"je m'en souviendrai pour la suite "
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
        f"de plante, ou me dire ta culture "
    )


def _climate_advice(temp, rain_mm, wind_speed) -> str:
    if temp is None:
        return ""
    if rain_mm > 10:
        return "Fortes pluies en cours : surveille les risques de maladies fongiques sur tes cultures."
    if temp > 33:
        return "Forte chaleur : pense à irriguer si possible."
    if wind_speed > 15:
        return "Vents forts : protège les jeunes plants si besoin."
    return "Conditions climatiques stables aujourd'hui."
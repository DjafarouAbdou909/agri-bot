"""
Services métier liés aux agriculteurs.
Toute logique de lecture/écriture sur Farmer et Interaction passe par ici.
"""
from .models import Farmer, Interaction

KNOWN_CROPS = [
    "cacao", "maïs", "mais", "riz", "manioc", "igname",
    "tomate", "piment", "banane", "plantain", "café", "anacarde",
    "arachide", "coton", "hévéa", "palmier à huile", "ananas",
    "gombo", "aubergine", "oignon", "patate douce",
]

# Principales villes ivoiriennes reconnues - pas de région par défaut,
# on demande explicitement à l'agriculteur (retour jury : éviter de
# présumer "Abidjan" pour tout le pays).
KNOWN_CITIES = [
    "abidjan", "bouaké", "bouake", "yamoussoukro", "san-pédro", "san pedro",
    "korhogo", "daloa", "man", "gagnoa", "abengourou", "divo", "anyama",
    "agboville", "grand-bassam", "grand bassam", "soubré", "soubre",
    "bondoukou", "séguéla", "seguela", "odienné", "odienne", "issia",
    "dimbokro", "tiassalé", "tiassale", "katiola", "ferkessédougou",
    "ferkessedougou", "bingerville", "adzopé", "adzope", "sinfra",
]

# Villes mises en avant dans le message de bienvenue (les plus connues/
# reconnaissables, pour ne pas noyer l'agriculteur sous 30 options)
SUGGESTED_CITIES = [
    "Abidjan", "Bouaké", "Yamoussoukro", "San-Pédro",
    "Korhogo", "Daloa", "Man", "Gagnoa",
]

CONVERSATION_HISTORY_LIMIT = 6


def get_or_create_farmer(phone_number: str) -> tuple[Farmer, bool]:
    """
    Crée un agriculteur SANS région par défaut. La ville sera demandée
    explicitement au premier contact (voir weather/welcome.py).
    """
    farmer, created = Farmer.objects.get_or_create(phone_number=phone_number)
    return farmer, created


def log_interaction(
    farmer: Farmer,
    message_type: str,
    response: str,
    raw_content: str = "",
    whatsapp_message_id: str = "",
) -> Interaction:
    return Interaction.objects.create(
        farmer=farmer,
        message_type=message_type,
        raw_content=raw_content,
        response=response,
        whatsapp_message_id=whatsapp_message_id,
    )


def get_recent_conversation(farmer: Farmer, limit: int = CONVERSATION_HISTORY_LIMIT) -> list[dict]:
    recent_interactions = (
        Interaction.objects
        .filter(farmer=farmer, message_type__in=["text", "audio"])
        .exclude(raw_content="")
        .order_by("-created_at")[:limit]
    )
    history = []
    for interaction in reversed(list(recent_interactions)):
        history.append({"role": "user", "content": interaction.raw_content})
        history.append({"role": "assistant", "content": interaction.response})
    return history


def try_update_crop_from_text(farmer: Farmer, user_text: str) -> bool:
    text_lower = user_text.lower()
    for crop in KNOWN_CROPS:
        if crop in text_lower:
            normalized_crop = "maïs" if crop == "mais" else crop
            farmer.crop = normalized_crop
            farmer.save(update_fields=["crop", "updated_at"])
            return True
    return False


def try_update_region_from_text(farmer: Farmer, user_text: str) -> bool:
    """
    Détecte si le message contient le nom d'une ville ivoirienne connue
    et met à jour la région de l'agriculteur. Retourne True si détecté.
    """
    text_lower = user_text.lower()
    normalized_map = {
        "Bouake": "Bouaké", "San Pedro": "San-Pédro", "Seguela": "Séguéla",
        "Odienne": "Odienné", "Ferkessedougou": "Ferkessédougou",
        "Adzope": "Adzopé", "Soubre": "Soubré", "Grand Bassam": "Grand-Bassam",
        "Tiassale": "Tiassalé",
    }
    for city in KNOWN_CITIES:
        if city in text_lower:
            base = city.title()
            final_city = normalized_map.get(base, base)
            farmer.region = final_city
            farmer.save(update_fields=["region", "updated_at"])
            return True
    return False
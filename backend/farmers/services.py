"""
Services métier liés aux agriculteurs.
Toute logique de lecture/écriture sur Farmer et Interaction passe par ici,
pour ne jamais avoir d'accès direct au modèle depuis routing/tasks.py.
"""
from .models import Farmer, Interaction

KNOWN_CROPS = ["cacao", "maïs", "mais", "riz", "manioc", "igname"]


def get_or_create_farmer(phone_number: str) -> tuple[Farmer, bool]:
    farmer, created = Farmer.objects.get_or_create(
        phone_number=phone_number,
        defaults={"region": DEFAULT_REGION},
    )
    return farmer, created


def log_interaction(farmer: Farmer, message_type: str, response: str, raw_content: str = "") -> Interaction:
    return Interaction.objects.create(
        farmer=farmer,
        message_type=message_type,
        raw_content=raw_content,
        response=response,
    )


def try_update_crop_from_text(farmer: Farmer, user_text: str) -> bool:
    """
    Détecte "ma culture est le cacao" / "je cultive du maïs" et met à jour
    le profil. Retourne True si une culture a été détectée.
    """
    text_lower = user_text.lower()
    for crop in KNOWN_CROPS:
        if crop in text_lower:
            normalized_crop = "maïs" if crop == "mais" else crop
            farmer.crop = normalized_crop
            farmer.save(update_fields=["crop", "updated_at"])
            return True
    return False
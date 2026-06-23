"""
Services métier liés aux agriculteurs.
Toute logique de lecture/écriture sur Farmer et Interaction passe par ici,
pour ne jamais avoir d'accès direct au modèle depuis routing/tasks.py.
"""
from .models import Farmer, Interaction

KNOWN_CROPS = [
    "cacao", "maïs", "mais", "riz", "manioc", "igname",
    "tomate", "piment", "banane", "plantain", "café", "anacarde",
    "arachide", "coton", "hévéa", "palmier à huile", "ananas",
    "gombo", "aubergine", "oignon", "patate douce",
]
DEFAULT_REGION = "Abidjan"
CONVERSATION_HISTORY_LIMIT = 6


def get_or_create_farmer(phone_number: str) -> tuple[Farmer, bool]:
    farmer, created = Farmer.objects.get_or_create(
        phone_number=phone_number,
        defaults={"region": DEFAULT_REGION},
    )
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
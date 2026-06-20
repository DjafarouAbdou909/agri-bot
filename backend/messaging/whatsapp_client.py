"""
Client pour interagir avec l'API WhatsApp Cloud (Meta).
Responsabilités :
- envoyer un message texte à un agriculteur
- récupérer l'URL d'un média (audio/image) reçu
- télécharger le contenu binaire d'un média
"""
import requests
from django.conf import settings

GRAPH_API_VERSION = "v20.0"
GRAPH_API_BASE = f"https://graph.facebook.com/{GRAPH_API_VERSION}"


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }


def send_whatsapp_message(phone_number: str, text: str) -> bool:
    """
    Envoie un message texte à un agriculteur via WhatsApp Cloud API.
    Retourne True si l'envoi a réussi, False sinon (jamais d'exception levée
    ici : un échec d'envoi ne doit jamais faire planter le pipeline).
    """
    url = f"{GRAPH_API_BASE}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "text",
        "text": {"body": text},
    }

    try:
        response = requests.post(url, headers=_headers(), json=payload, timeout=10)
        response.raise_for_status()
        return True
    except requests.RequestException as exc:
        print(f"[whatsapp_client] Échec d'envoi à {phone_number} : {exc}")
        return False


def get_media_url(media_id: str) -> str | None:
    """
    Récupère l'URL temporaire de téléchargement d'un média (audio/image)
    à partir de son media_id fourni dans le webhook entrant.
    """
    url = f"{GRAPH_API_BASE}/{media_id}"
    try:
        response = requests.get(
            url,
            headers={"Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}"},
            timeout=10,
        )
        response.raise_for_status()
        return response.json().get("url")
    except requests.RequestException as exc:
        print(f"[whatsapp_client] Échec récupération URL média {media_id} : {exc}")
        return None


def download_media(media_url: str) -> bytes | None:
    """
    Télécharge le contenu binaire d'un média depuis l'URL temporaire Meta.
    Nécessite le token d'accès même pour le téléchargement (URL signée mais
    Meta exige aussi le header Authorization).
    """
    try:
        response = requests.get(
            media_url,
            headers={"Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}"},
            timeout=15,
        )
        response.raise_for_status()
        return response.content
    except requests.RequestException as exc:
        print(f"[whatsapp_client] Échec téléchargement média : {exc}")
        return None
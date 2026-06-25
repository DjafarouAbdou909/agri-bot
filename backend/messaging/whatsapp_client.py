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
        print(f"[whatsapp_client] Échec d'envoi texte à {phone_number} : {exc}")
        return False


def upload_audio_media(audio_bytes: bytes) -> str | None:
    url = f"{GRAPH_API_BASE}/{settings.WHATSAPP_PHONE_NUMBER_ID}/media"
    try:
        response = requests.post(
            url,
            headers={"Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}"},
            files={"file": ("response.mp3", audio_bytes, "audio/mpeg")},
            data={"messaging_product": "whatsapp"},
            timeout=20,
        )
        response.raise_for_status()
        return response.json().get("id")
    except requests.RequestException as exc:
        print(f"[whatsapp_client] Échec upload audio : {exc}")
        return None


def send_whatsapp_audio(phone_number: str, audio_bytes: bytes) -> bool:
    media_id = upload_audio_media(audio_bytes)
    if not media_id:
        return False

    url = f"{GRAPH_API_BASE}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "audio",
        "audio": {"id": media_id},
    }
    try:
        response = requests.post(url, headers=_headers(), json=payload, timeout=10)
        response.raise_for_status()
        return True
    except requests.RequestException as exc:
        print(f"[whatsapp_client] Échec d'envoi audio à {phone_number} : {exc}")
        return False


def get_media_url(media_id: str) -> str | None:
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
import google.generativeai as genai
from django.conf import settings

from messaging.whatsapp_client import get_media_url, download_media

_configured = False


def _ensure_configured():
    global _configured
    if not _configured:
        genai.configure(api_key=settings.GOOGLE_AI_API_KEY)
        _configured = True


def transcribe_audio(media_id: str) -> str | None:
    _ensure_configured()

    media_url = get_media_url(media_id)
    if not media_url:
        return None

    audio_bytes = download_media(media_url)
    if not audio_bytes:
        return None

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content([
            "Transcris cet audio en français. Renvoie uniquement le texte transcrit, sans commentaire.",
            {"mime_type": "audio/ogg", "data": audio_bytes},
        ])
        return response.text.strip()
    except Exception as exc:
        print(f"[nlp.transcription] Échec transcription audio : {exc}")
        return None
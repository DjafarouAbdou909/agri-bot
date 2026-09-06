"""
Transcription audio via Gemini, pour comprendre les messages vocaux
envoyés par les agriculteurs sur WhatsApp.
"""
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
        print(f"[nlp.transcription] Échec récupération URL pour media_id={media_id}")
        return None

    audio_bytes = download_media(media_url)
    if not audio_bytes:
        print(f"[nlp.transcription] Échec téléchargement audio pour media_id={media_id}")
        return None

    if len(audio_bytes) < 1000:
        print(f"[nlp.transcription] Audio trop court ({len(audio_bytes)} bytes), probablement inaudible.")
        return None

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content([
            "Transcris cet audio en français. Renvoie uniquement le texte transcrit, sans commentaire. "
            "Si l'audio est silencieux, vide, ou incomprehensible, réponds exactement: INAUDIBLE",
            {"mime_type": "audio/ogg", "data": audio_bytes},
        ])
        text = response.text.strip()

        if text.upper() == "INAUDIBLE" or len(text) < 2:
            print(f"[nlp.transcription] Gemini a jugé l'audio inaudible (media_id={media_id})")
            return None

        return text

    except Exception as exc:
        print(f"[nlp.transcription] Échec transcription audio (media_id={media_id}) : {exc}")
        return None
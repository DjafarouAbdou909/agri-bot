import google.generativeai as genai
from django.conf import settings

from messaging.whatsapp_client import get_media_url, download_media
from nlp.prompts import DIAGNOSIS_PROMPT_TEMPLATE

_configured = False


def _ensure_configured():
    global _configured
    if not _configured:
        genai.configure(api_key=settings.GOOGLE_AI_API_KEY)
        _configured = True


def diagnose_plant(media_id: str, farmer) -> str:
    _ensure_configured()

    media_url = get_media_url(media_id)
    if not media_url:
        return "Je n'ai pas pu récupérer ton image. Réessaie de l'envoyer 📸"

    image_bytes = download_media(media_url)
    if not image_bytes:
        return "Je n'ai pas pu télécharger ton image. Réessaie de l'envoyer 📸"

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        image_file = genai.upload_file_from_bytes(image_bytes, mime_type="image/jpeg")
        prompt = DIAGNOSIS_PROMPT_TEMPLATE.format(crop=farmer.crop or "non précisée")
        response = model.generate_content([prompt, image_file])
        return response.text.strip()
    except Exception as exc:
        print(f"[vision.disease_client] Échec diagnostic image : {exc}")
        return "Je n'ai pas pu analyser cette image. Essaie une photo plus nette, de près, sous bonne lumière 📸"
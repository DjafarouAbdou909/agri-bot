# vision/disease_client.py
import logging

from google import genai
from google.genai import types
from google.genai.errors import APIError
from django.conf import settings

from messaging.whatsapp_client import get_media_url, download_media
from nlp.prompts import DIAGNOSIS_PROMPT_TEMPLATE

logger = logging.getLogger(__name__)

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GOOGLE_AI_API_KEY)
    return _client


def diagnose_plant(media_id: str, farmer) -> str:
    media_url = get_media_url(media_id)
    if not media_url:
        logger.warning("[vision.disease_client] URL média introuvable pour media_id=%s", media_id)
        return "Je n'ai pas pu récupérer ton image. Réessaie de l'envoyer 📸"

    image_bytes = download_media(media_url)
    if not image_bytes:
        logger.warning("[vision.disease_client] Téléchargement média vide pour media_id=%s", media_id)
        return "Je n'ai pas pu télécharger ton image. Réessaie de l'envoyer 📸"

    # Garde-fou : détecte un téléchargement corrompu (ex: JSON d'erreur au lieu d'une image)
    if len(image_bytes) < 100 or image_bytes[:4] == b'{"er':
        logger.error("[vision.disease_client] Contenu média suspect (taille=%d) pour media_id=%s", len(image_bytes), media_id)
        return "Je n'ai pas pu lire cette image. Réessaie de l'envoyer 📸"

    try:
        client = _get_client()
        prompt = DIAGNOSIS_PROMPT_TEMPLATE.format(crop=farmer.crop or "non précisée")

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                prompt,
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
            ],
        )

        # response.text peut lever si la réponse a été bloquée par les filtres de sécurité
        if not response.candidates:
            logger.error("[vision.disease_client] Aucune candidate retournée pour media_id=%s", media_id)
            return "Je n'ai pas pu analyser cette image. Essaie une photo plus nette, de près, sous bonne lumière 📸"

        finish_reason = response.candidates[0].finish_reason
        if finish_reason not in (None, "STOP", 1):  # 1 = FinishReason.STOP selon version SDK
            logger.error("[vision.disease_client] Réponse bloquée, finish_reason=%s pour media_id=%s", finish_reason, media_id)
            return "Je n'ai pas pu analyser cette image (contenu non reconnu). Essaie une autre photo 📸"

        text = response.text
        if not text or not text.strip():
            logger.error("[vision.disease_client] Réponse vide pour media_id=%s", media_id)
            return "Je n'ai pas pu analyser cette image. Essaie une photo plus nette, de près, sous bonne lumière 📸"

        return text.strip()

    except APIError as exc:
        logger.error("[vision.disease_client] Erreur API Gemini (%s) pour media_id=%s : %s",
                     exc.__class__.__name__, media_id, exc, exc_info=True)
        return "Je n'ai pas pu analyser cette image. Essaie une photo plus nette, de près, sous bonne lumière 📸"
    except Exception as exc:
        logger.error("[vision.disease_client] Échec diagnostic image (%s) pour media_id=%s : %s",
                     exc.__class__.__name__, media_id, exc, exc_info=True)
        return "Je n'ai pas pu analyser cette image. Essaie une photo plus nette, de près, sous bonne lumière 📸"
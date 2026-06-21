from celery import shared_task

from .dispatcher import get_message_type
from nlp.engine import generate_text_response
from nlp.transcription import transcribe_audio
from vision.disease_client import diagnose_plant
from weather.welcome import build_welcome_message
from messaging.whatsapp_client import send_whatsapp_message
from farmers.services import get_or_create_farmer, log_interaction, try_update_crop_from_text


@shared_task
def process_incoming_message(phone_number: str, message: dict):
    farmer, created = get_or_create_farmer(phone_number)

    if created:
        welcome_text = build_welcome_message(farmer)
        send_whatsapp_message(phone_number, welcome_text)
        log_interaction(farmer, "text", welcome_text, raw_content="[bienvenue automatique]")

    msg_type = get_message_type(message)
    raw_content = ""

    if msg_type == "text":
        user_text = message["text"]["body"]
        raw_content = user_text
        try_update_crop_from_text(farmer, user_text)
        response = generate_text_response(user_text, farmer)

    elif msg_type == "audio":
        media_id = message["audio"]["id"]
        user_text = transcribe_audio(media_id)
        if not user_text:
            response = "Je n'ai pas pu comprendre l'audio. Peux-tu réessayer en texte ?"
        else:
            raw_content = user_text
            try_update_crop_from_text(farmer, user_text)
            response = generate_text_response(user_text, farmer)

    elif msg_type == "image":
        media_id = message["image"]["id"]
        response = diagnose_plant(media_id, farmer)

    else:
        response = "Je ne comprends pas ce type de message. Envoie un texte, une voix ou une photo de plante 🌱"

    send_whatsapp_message(phone_number, response)
    log_interaction(farmer, msg_type, response, raw_content=raw_content)

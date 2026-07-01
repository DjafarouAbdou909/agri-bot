from celery import shared_task

from .dispatcher import get_message_type
from core.storage import upload_image, upload_audio
from nlp.engine import generate_text_response
from nlp.transcription import transcribe_audio
from nlp.tts import generate_speech_mp3
from vision.disease_client import diagnose_plant
from weather.welcome import build_welcome_message, build_city_confirmation_message
from messaging.whatsapp_client import send_whatsapp_message, send_whatsapp_audio
from messaging.media_client import download_media, get_media_url  # adapte l'import selon où sont ces fonctions
from farmers.models import Interaction
from farmers.services import (
    get_or_create_farmer,
    log_interaction,
    try_update_crop_from_text,
    try_update_region_from_text,
    get_recent_conversation,
)


@shared_task
def process_incoming_message(phone_number: str, message: dict):
    whatsapp_message_id = message.get("id", "")
    if whatsapp_message_id and Interaction.objects.filter(
        whatsapp_message_id=whatsapp_message_id
    ).exists():
        print(f"[routing.tasks] Message {whatsapp_message_id} déjà traité, on ignore.")
        return

    farmer, created = get_or_create_farmer(phone_number)

    if created:
        welcome_text = build_welcome_message(farmer)
        send_whatsapp_message(phone_number, welcome_text)
        log_interaction(farmer, "text", welcome_text, raw_content="[bienvenue automatique]")

    msg_type = get_message_type(message)
    raw_content = ""
    media_url = ""
    had_region_before = bool(farmer.region)

    if msg_type == "text":
        user_text = message["text"]["body"]
        raw_content = user_text
        try_update_crop_from_text(farmer, user_text)
        city_just_set = try_update_region_from_text(farmer, user_text)

        if city_just_set and not had_region_before:
            confirmation = build_city_confirmation_message(farmer)
            send_whatsapp_message(phone_number, confirmation)
            log_interaction(farmer, "text", confirmation, raw_content="[confirmation ville]")

        history = get_recent_conversation(farmer)
        response = generate_text_response(user_text, farmer, conversation_history=history)
        send_whatsapp_message(phone_number, response)

    elif msg_type == "audio":
        media_id = message["audio"]["id"]

        # Téléchargement + upload Cloudinary de l'audio reçu
        audio_bytes_raw = download_media(get_media_url(media_id))
        if audio_bytes_raw:
            media_url = upload_audio(audio_bytes_raw, phone_number) or ""

        user_text = transcribe_audio(media_id)

        if not user_text:
            response = "Je n'ai pas pu comprendre l'audio. Peux-tu réessayer en texte ?"
            send_whatsapp_message(phone_number, response)
        else:
            raw_content = user_text
            try_update_crop_from_text(farmer, user_text)
            city_just_set = try_update_region_from_text(farmer, user_text)

            if city_just_set and not had_region_before:
                confirmation = build_city_confirmation_message(farmer)
                send_whatsapp_message(phone_number, confirmation)
                log_interaction(farmer, "text", confirmation, raw_content="[confirmation ville]")

            history = get_recent_conversation(farmer)
            response = generate_text_response(user_text, farmer, conversation_history=history)

            audio_bytes_tts = generate_speech_mp3(response)
            if audio_bytes_tts:
                send_whatsapp_audio(phone_number, audio_bytes_tts)
            else:
                send_whatsapp_message(phone_number, response)

    elif msg_type == "image":
        media_id = message["image"]["id"]

        # Téléchargement + upload Cloudinary de l'image reçue
        image_bytes_raw = download_media(get_media_url(media_id))
        image_url = ""
        if image_bytes_raw:
            image_url = upload_image(image_bytes_raw, phone_number) or ""

        response = diagnose_plant(media_id, farmer)
        send_whatsapp_message(phone_number, response)

        log_interaction(
            farmer, msg_type, response,
            raw_content="",
            whatsapp_message_id=whatsapp_message_id,
            media_url=image_url,
        )
        return

    else:
        response = "Je ne comprends pas ce type de message. Envoie un texte, une voix ou une photo de plante 🌱"
        send_whatsapp_message(phone_number, response)

    log_interaction(
        farmer, msg_type, response,
        raw_content=raw_content,
        whatsapp_message_id=whatsapp_message_id,
        media_url=media_url,
    )
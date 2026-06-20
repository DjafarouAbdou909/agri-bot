def get_message_type(message: dict) -> str:
    """Détermine le type de message WhatsApp."""
    if "text" in message:
        return "text"
    if "audio" in message:
        return "audio"
    if "image" in message:
        return "image"
    return "unsupported"

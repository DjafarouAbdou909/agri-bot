"""
Gestion du stockage des médias (images, audio) sur Cloudinary.
Les binaires ne sont jamais stockés en base — seulement les URLs.
"""
import cloudinary
import cloudinary.uploader
from django.conf import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)


def upload_image(image_bytes: bytes, farmer_phone: str) -> str | None:
    """
    Upload une image sur Cloudinary et retourne l'URL publique.
    Retourne None en cas d'échec.
    """
    try:
        result = cloudinary.uploader.upload(
            image_bytes,
            folder=f"agribot/images/{farmer_phone}",
            resource_type="image",
        )
        return result.get("secure_url")
    except Exception as exc:
        print(f"[storage] Échec upload image : {exc}")
        return None


def upload_audio(audio_bytes: bytes, farmer_phone: str) -> str | None:
    """
    Upload un fichier audio sur Cloudinary et retourne l'URL publique.
    Retourne None en cas d'échec.
    """
    try:
        result = cloudinary.uploader.upload(
            audio_bytes,
            folder=f"agribot/audio/{farmer_phone}",
            resource_type="video",  # Cloudinary traite audio sous "video"
        )
        return result.get("secure_url")
    except Exception as exc:
        print(f"[storage] Échec upload audio : {exc}")
        return None
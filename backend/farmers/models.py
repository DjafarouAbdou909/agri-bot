from django.db import models


class Farmer(models.Model):
    """Représente un agriculteur identifié par son numéro WhatsApp."""

    LANGUAGE_CHOICES = [
        ("fr", "Français"),
    ]

    phone_number = models.CharField(max_length=20, unique=True, db_index=True)
    crop = models.CharField(max_length=50, blank=True, default="")
    region = models.CharField(max_length=100, blank=True, default="")
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default="fr")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.phone_number} ({self.crop or 'culture non précisée'})"


class Interaction(models.Model):
    """Historique d'une interaction agriculteur ↔ AGRI-BOT."""

    MESSAGE_TYPE_CHOICES = [
        ("text", "Texte"),
        ("audio", "Audio"),
        ("image", "Image"),
        ("unsupported", "Non supporté"),
    ]

    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name="interactions")
    message_type = models.CharField(max_length=15, choices=MESSAGE_TYPE_CHOICES)
    raw_content = models.TextField(blank=True, default="")
    response = models.TextField(blank=True, default="")
    whatsapp_message_id = models.CharField(max_length=100, blank=True, default="", db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.farmer.phone_number} - {self.message_type} - {self.created_at:%Y-%m-%d %H:%M}"

"""
Synthèse vocale (Text-to-Speech) via Gemini, pour répondre par message
vocal aux agriculteurs qui envoient eux-mêmes des messages vocaux
(important pour les agriculteurs illettrés qui ne peuvent pas lire
les réponses texte).
"""
import base64
import subprocess
import tempfile
import os

import google.generativeai as genai
from django.conf import settings

_configured = False


def _ensure_configured():
    global _configured
    if not _configured:
        genai.configure(api_key=settings.GOOGLE_AI_API_KEY)
        _configured = True


def generate_speech_mp3(text: str) -> bytes | None:
    _ensure_configured()

    try:
        model = genai.GenerativeModel("gemini-2.5-flash-preview-tts")
        response = model.generate_content(
            text,
            generation_config={"response_modalities": ["AUDIO"]},
        )

        audio_part = response.candidates[0].content.parts[0].inline_data
        raw_data = audio_part.data
        raw_bytes = base64.b64decode(raw_data) if isinstance(raw_data, str) else raw_data

        with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as pcm_file:
            pcm_file.write(raw_bytes)
            pcm_path = pcm_file.name

        mp3_path = pcm_path.replace(".pcm", ".mp3")

        result = subprocess.run(
            ["ffmpeg", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1",
             "-i", pcm_path, mp3_path],
            capture_output=True,
            timeout=30,
        )

        if result.returncode != 0:
            print(f"[nlp.tts] Échec conversion ffmpeg : {result.stderr.decode()}")
            os.remove(pcm_path)
            return None

        with open(mp3_path, "rb") as f:
            mp3_bytes = f.read()

        os.remove(pcm_path)
        os.remove(mp3_path)

        return mp3_bytes

    except Exception as exc:
        print(f"[nlp.tts] Échec génération audio : {exc}")
        return None
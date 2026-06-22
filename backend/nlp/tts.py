"""
Synthèse vocale (Text-to-Speech) via Gemini, pour répondre par message
vocal aux agriculteurs qui envoient eux-mêmes des messages vocaux
(important pour les agriculteurs illettrés qui ne peuvent pas lire
les réponses texte).

NOTE MIGRATION : ce module utilise le nouveau SDK unifié `google-genai`
(package `google-genai`, import `from google import genai`), et non
l'ancien `google-generativeai` (déprécié). C'est nécessaire car
`response_modalities` / la génération audio TTS n'existe que dans le
nouveau SDK - l'ancien `GenerationConfig` ne connaît pas ce champ et
lève "Unknown field for GenerationConfig: response_modalities".
"""
import base64
import subprocess
import tempfile
import os

from google import genai
from google.genai import types
from django.conf import settings

_client = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GOOGLE_AI_API_KEY)
    return _client


def generate_speech_mp3(text: str) -> bytes | None:
    try:
        client = _get_client()

        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name="Kore",
                        )
                    )
                ),
            ),
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
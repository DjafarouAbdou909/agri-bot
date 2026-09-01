import re

import requests
from django.conf import settings

from .prompts import SYSTEM_PROMPT_TEMPLATE

GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions"

# Filet de sécurité : si jamais un <think> apparaît quand même dans le
# contenu (ex: comportement futur de l'API), on le retire.
_THINK_TAG_CLOSED_RE = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)
_THINK_TAG_UNCLOSED_RE = re.compile(r"<think>.*", re.DOTALL | re.IGNORECASE)


def _strip_reasoning(text: str) -> str:
    cleaned = _THINK_TAG_CLOSED_RE.sub("", text)
    cleaned = _THINK_TAG_UNCLOSED_RE.sub("", cleaned)
    return cleaned.strip()


def generate_text_response(
    user_text: str,
    farmer,
    conversation_history: list[dict] | None = None
) -> str:
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
        crop=farmer.crop or "non précisée",
        region=farmer.region or "non précisée",
    )

    messages = [{"role": "system", "content": system_prompt}]

    if conversation_history:
        messages.extend(conversation_history)

    messages.append({"role": "user", "content": user_text})

    payload = {
        "model": "qwen/qwen3.6-27b",
        "max_tokens": 500,
        "messages": messages,
        # Appel HTTP direct (plutôt que via le SDK groq) car le SDK installé
        # ici est trop ancien et rejette ce paramètre ("unexpected keyword
        # argument"). L'API REST, elle, l'accepte très bien.
        # reasoning_effort="none" désactive complètement le mode raisonnement
        # de qwen3.6-27b : plus de <think>, plus de budget de tokens englouti
        # par un raisonnement de longueur imprévisible avant la réponse finale.
        "reasoning_effort": "none",
    }

    try:
        response = requests.post(
            GROQ_CHAT_COMPLETIONS_URL,
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()

        content = data["choices"][0]["message"]["content"] or ""
        cleaned = _strip_reasoning(content)

        if not cleaned:
            print(
                "[nlp.engine] Réponse vide après nettoyage (contenu inattendu) "
                f"— payload brut : {data}",
                flush=True,
            )
            return (
                "Désolé, je n'ai pas pu traiter ta question pour le moment. "
                "Réessaie dans un instant 🙏"
            )

        return cleaned

    except Exception as exc:
        print(f"[nlp.engine] Échec génération réponse texte : {exc}", flush=True)
        return (
            "Désolé, je n'ai pas pu traiter ta question pour le moment. "
            "Réessaie dans un instant 🙏"
        )
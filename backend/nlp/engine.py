import re

from groq import Groq
from django.conf import settings

from .prompts import SYSTEM_PROMPT_TEMPLATE

_client = None

# Nettoie le raisonnement interne que certains modèles (dont qwen/qwen3.6-27b)
# renvoient dans le contenu, entouré de balises <think>...</think>, quand le
# paramètre reasoning_format n'est pas disponible ou pas respecté.
_THINK_TAG_RE = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


def _strip_reasoning(text: str) -> str:
    cleaned = _THINK_TAG_RE.sub("", text)
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

    try:
        # Pas de reasoning_format ici : le SDK groq installé sur cet
        # environnement ne le supporte pas encore (voir requirements.txt,
        # à mettre à jour séparément). On filtre le <think> nous-mêmes
        # ci-dessous, ce qui marche indépendamment de la version du SDK.
        response = _get_client().chat.completions.create(
            model="qwen/qwen3.6-27b",
            max_tokens=300,
            messages=messages,
        )

        content = response.choices[0].message.content or ""
        return _strip_reasoning(content)

    except Exception as exc:
        print(f"[nlp.engine] Échec génération réponse texte : {exc}", flush=True)
        return (
            "Désolé, je n'ai pas pu traiter ta question pour le moment. "
            "Réessaie dans un instant 🙏"
        )
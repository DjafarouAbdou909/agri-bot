import re

from groq import Groq
from django.conf import settings

from .prompts import SYSTEM_PROMPT_TEMPLATE

_client = None

# Nettoie le raisonnement interne que certains modèles (dont qwen/qwen3.6-27b)
# renvoient dans le contenu, entouré de balises <think>...</think>, quand le
# paramètre reasoning_format n'est pas disponible côté SDK.
_THINK_TAG_CLOSED_RE = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)
# Sécurité : si la génération est tronquée avant la balise fermante (ex:
# max_tokens trop bas), on retire quand même tout ce qui suit <think>,
# plutôt que de renvoyer du raisonnement brut et coupé à l'utilisateur.
_THINK_TAG_UNCLOSED_RE = re.compile(r"<think>.*", re.DOTALL | re.IGNORECASE)


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


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

    try:
        response = _get_client().chat.completions.create(
            model="qwen/qwen3.6-27b",
            # qwen3.6-27b est un modèle de raisonnement : il consomme une
            # partie du budget de tokens pour son <think> interne avant
            # même de commencer la réponse finale. 300 était trop bas et
            # coupait la génération en plein raisonnement (pas de réponse
            # utile du tout). On laisse largement de la marge ici.
            max_tokens=1024,
            messages=messages,
        )

        content = response.choices[0].message.content or ""
        cleaned = _strip_reasoning(content)

        if not cleaned:
            # Le raisonnement a mangé tout le budget de tokens malgré tout :
            # pas de réponse finale exploitable, on retombe sur le message
            # de secours plutôt que d'envoyer une chaîne vide.
            print(
                "[nlp.engine] Réponse vide après nettoyage du raisonnement "
                "(probable troncature) — fallback utilisé.",
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
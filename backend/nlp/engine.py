from groq import Groq
from django.conf import settings

from .prompts import SYSTEM_PROMPT_TEMPLATE

_client = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


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
            max_tokens=300,
            messages=messages,
            # qwen3.6-27b est un modèle de raisonnement : sans ce paramètre,
            # Groq renvoie le raisonnement interne brut dans le contenu,
            # entouré de balises <think>...</think>, souvent en anglais.
            # "hidden" garantit qu'on ne récupère que la réponse finale.
            reasoning_format="hidden",
            # Mode dialogue général (pas besoin de raisonnement profond pour
            # du conseil agricole conversationnel) : réponses plus rapides
            # et plus naturelles, cohérent avec le format WhatsApp attendu.
            reasoning_effort="none",
        )

        content = response.choices[0].message.content or ""
        return content.strip()

    except Exception as exc:
        # flush=True : ce code tourne dans un worker Celery, sans flush
        # explicite le message peut rester bufferisé et ne jamais
        # apparaître dans les logs (Render, Docker, etc.)
        print(f"[nlp.engine] Échec génération réponse texte : {exc}", flush=True)
        return (
            "Désolé, je n'ai pas pu traiter ta question pour le moment. "
            "Réessaie dans un instant 🙏"
        )
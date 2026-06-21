from groq import Groq
from django.conf import settings

from .prompts import SYSTEM_PROMPT_TEMPLATE

_client = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


def generate_text_response(user_text: str, farmer, conversation_history: list[dict] | None = None) -> str:
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
            model="llama-3.3-70b-versatile",
            max_tokens=300,
            messages=messages,
        )
        return response.choices[0].message.content
    except Exception as exc:
        print(f"[nlp.engine] Échec génération réponse texte : {exc}")
        return "Désolé, je n'ai pas pu traiter ta question pour le moment. Réessaie dans un instant 🙏"
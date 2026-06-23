from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings

from routing.tasks import process_incoming_message


class WhatsAppWebhookView(APIView):
    def get(self, request):
        mode = request.GET.get("hub.mode")
        token = request.GET.get("hub.verify_token")
        challenge = request.GET.get("hub.challenge")

        if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
            return Response(int(challenge))
        return Response(status=403)

    def post(self, request):
        try:
            entry = request.data["entry"][0]
            change = entry["changes"][0]["value"]

            if "messages" not in change:
                return Response(status=200)

            message = change["messages"][0]
            phone_number = message["from"]

            # NOTE : appel direct (synchrone) plutôt que process_incoming_message.delay(...).
            # On évite ainsi de dépendre d'un Background Worker Celery (payant sur Render).
            # Pour ce hackathon, le traitement se fait dans la requête HTTP elle-même :
            # quelques secondes de latence supplémentaires sur la réponse WhatsApp,
            # mais zéro service additionnel à payer/maintenir.
            # process_incoming_message reste une fonction @shared_task : l'appeler
            # directement (sans .delay) l'exécute simplement en synchrone, dans ce process.
            process_incoming_message(phone_number, message)

        except (KeyError, IndexError) as exc:
            print(f"[webhooks] Payload WhatsApp inattendu : {exc}", flush=True)

        return Response(status=200)
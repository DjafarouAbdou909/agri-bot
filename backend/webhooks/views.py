from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings

from routing.tasks import process_incoming_message


class WhatsAppWebhookView(APIView):
    def get(self, request):
        print("[webhooks] GET reçu sur /webhook/whatsapp/", flush=True)
        mode = request.GET.get("hub.mode")
        token = request.GET.get("hub.verify_token")
        challenge = request.GET.get("hub.challenge")

        if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
            return Response(int(challenge))
        return Response(status=403)

    def post(self, request):
        print(f"[webhooks] POST reçu sur /webhook/whatsapp/ : {request.data}", flush=True)
        try:
            entry = request.data["entry"][0]
            change = entry["changes"][0]["value"]

            if "messages" not in change:
                print("[webhooks] Pas de clé 'messages' dans le payload, ignoré.", flush=True)
                return Response(status=200)

            message = change["messages"][0]
            phone_number = message["from"]

            print(f"[webhooks] Message détecté de {phone_number}, envoi à Celery.", flush=True)
            process_incoming_message.delay(phone_number, message)

        except (KeyError, IndexError) as exc:
            print(f"[webhooks] Payload WhatsApp inattendu : {exc}", flush=True)

        return Response(status=200)
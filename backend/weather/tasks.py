from celery import shared_task

from .client import get_weather_for_region
from .rules import get_alert_message
from farmers.models import Farmer
from messaging.whatsapp_client import send_whatsapp_message


@shared_task
def send_daily_weather_alerts():
    farmers_with_region = Farmer.objects.exclude(region="")
    alerts_sent = 0

    for farmer in farmers_with_region:
        weather_data = get_weather_for_region(farmer.region)
        alert = get_alert_message(weather_data, farmer.crop or "tes cultures")

        if alert:
            success = send_whatsapp_message(farmer.phone_number, alert)
            if success:
                alerts_sent += 1

    print(f"[weather.tasks] Alertes météo envoyées : {alerts_sent}/{farmers_with_region.count()}")
    return alerts_sent
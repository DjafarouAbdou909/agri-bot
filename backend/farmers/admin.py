from django.contrib import admin
from .models import Farmer, Interaction

@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'crop', 'region', 'language', 'created_at']
    search_fields = ['phone_number', 'crop', 'region']

@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'message_type', 'created_at']
    search_fields = ['farmer__phone_number', 'raw_content']
    list_filter = ['message_type']

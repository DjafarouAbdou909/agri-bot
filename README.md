# AGRI-BOT 🌱

Assistant agricole intelligent sur WhatsApp pour les agriculteurs d'Afrique francophone, en particulier la Côte d'Ivoire.

## En bref

L'agriculteur envoie un message (texte, vocal, ou photo de plante) sur WhatsApp, et AGRI-BOT répond avec des conseils agricoles adaptés à sa culture, un diagnostic de maladie, ou une alerte météo.

---

## Fonctionnalités

| Fonctionnalité | Description 
|---|---|---|
| **Texte** | Question agricole en texte → réponse contextualisée (Groq / Llama 3.3) 
| **Vocal** | Message vocal → transcription (Gemini) → réponse 
| **Image** | Photo de plante → diagnostic de maladie (Gemini Vision) 
| **Météo** | Message de bienvenue automatique avec météo au premier contact + alertes quotidiennes (pluie/chaleur/vent) 
| **Détection de culture** | Détecte automatiquement la culture déclarée dans un message ("je cultive du cacao") 

---

## Stack technique

- **Backend** : Django + Django REST Framework
- **Tâches asynchrones** : Celery + Redis (le webhook doit répondre vite à Meta, tout traitement lourd passe en tâche de fond)
- **Base de données** : PostgreSQL
- **Messagerie** : WhatsApp Cloud API (Meta)
- **IA texte** : Groq (Llama 3.3 70B) — rapide, gratuit en tier de base
- **IA vocal + image** : Google Gemini (`gemini-2.5-flash`) — multimodal, gère transcription audio et analyse d'image
- **Météo** : OpenWeatherMap

**Pourquoi ce choix d'API plutôt que des modèles entraînés maison ?** Aucun modèle n'a été entraîné from scratch — tout passe par des API ou modèles pré-entraînés, pour rester réaliste sur un délai de hackathon. C'est un choix d'architecture volontaire, pas un raccourci.

---

## Structure du projet

```
backend/
├── config/          # settings Django, Celery, urls principales
├── webhooks/        # réception des messages WhatsApp (point d'entrée)
├── routing/         # dispatch texte/audio/image + tâche Celery centrale
├── nlp/             # génération de réponse texte (Groq) + transcription audio (Gemini)
├── vision/          # diagnostic de maladie depuis une image (Gemini Vision)
├── weather/         # météo (OpenWeatherMap), règles d'alerte, message de bienvenue
├── farmers/         # modèle Farmer (profil agriculteur) + Interaction (historique)
└── messaging/       # client WhatsApp (envoi de message, téléchargement de média)
```

### Flux d'un message entrant

```
Agriculteur envoie un message sur WhatsApp
        ↓
Meta appelle webhooks/views.py (POST /webhook/whatsapp/)
        ↓
La tâche Celery routing/tasks.py::process_incoming_message est lancée en arrière-plan
        ↓
Selon le type de message :
  - texte  → nlp/engine.py (Groq)
  - audio  → nlp/transcription.py (Gemini) puis nlp/engine.py (Groq)
  - image  → vision/disease_client.py (Gemini Vision)
        ↓
La réponse est envoyée via messaging/whatsapp_client.py
```

**Particularité** : au tout premier contact d'un agriculteur (détecté via `created=True` dans `get_or_create_farmer`), un message de bienvenue avec la météo actuelle est envoyé automatiquement, avant le traitement normal du message.

---

## Installation et lancement en local

### 1. Cloner et installer les dépendances

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplis `.env` avec tes vraies clés (jamais dans `.env.example`, qui reste avec des placeholders) :

```dotenv
DJANGO_SECRET_KEY=...
WHATSAPP_VERIFY_TOKEN=...       # string que TU inventes
WHATSAPP_ACCESS_TOKEN=...       # depuis Meta for Developers (expire en 24h en mode test)
WHATSAPP_PHONE_NUMBER_ID=...    # depuis Meta for Developers
GROQ_API_KEY=...                # console.groq.com
GOOGLE_AI_API_KEY=...           # aistudio.google.com
OPENWEATHER_API_KEY=...         # openweathermap.org
```


### 3. Lancer l'infrastructure (Postgres + Redis)

```bash
docker-compose up -d db redis
```

> Si tu lances Django/Celery nativement (pas dans Docker), utilise `localhost` comme host dans `.env`, pas `db`/`redis` (ces noms ne sont valables que dans le réseau Docker Compose).

### 4. Migrations

```bash
python manage.py migrate
```

### 5. Lancer les services (dans des terminaux séparés)

```bash
# Terminal 1 — worker Celery
celery -A config worker -l info

# Terminal 2 — serveur Django
python manage.py runserver

# Terminal 3 — exposer le serveur publiquement (pour les tests locaux)
ngrok http 8000
```

### 6. Configurer le webhook sur Meta

Sur [developers.facebook.com](https://developers.facebook.com) → ton app → WhatsApp → Configuration → Webhook :
- **URL de rappel** : `https://<ton-url-ngrok>/webhook/whatsapp/`
- **Token de vérification** : la valeur exacte de `WHATSAPP_VERIFY_TOKEN` dans `.env`
- Active le champ webhook **`messages`**

---

## Tester sans passer par WhatsApp

Chaque brique peut être testée isolément dans le shell Django (`python manage.py shell`), utile pour debug rapide :

```python
# Tester Groq
from farmers.services import get_or_create_farmer
from nlp.engine import generate_text_response

farmer, _ = get_or_create_farmer("test123")
print(generate_text_response("Comment protéger mon cacao ?", farmer))

# Tester la météo
from weather.client import get_weather_for_region
print(get_weather_for_region("Abidjan"))
```

---

## Pièges connus / leçons apprises pendant le développement

- **Versions de libs sensibles** : `groq` doit être en version `1.4.0+` (versions antérieures incompatibles avec `httpx` récent)
- **Modèles Gemini dépréciés rapidement** : si une erreur `404 models/... is not found` apparaît, lister les modèles disponibles avec `genai.list_models()` et mettre à jour le nom du modèle partout (`nlp/engine.py`, `vision/disease_client.py`, `nlp/transcription.py`)
- **Syntaxe Gemini pour fichiers** : ne pas utiliser `genai.upload_file_from_bytes` (n'existe pas) — passer directement `{"mime_type": ..., "data": bytes}` dans `generate_content([...])`
- **Token WhatsApp temporaire** : expire en 24h en mode développement, à régénérer régulièrement sur Meta for Developers
- **`db`/`redis` vs `localhost`** : ces noms d'hôte ne fonctionnent que si le service appelant tourne *dans* Docker Compose ; en exécution native, utiliser `localhost`

---

## Pour aller plus loin (hors scope MVP actuel)

- Réponses vocales (TTS) en plus du texte
- Hébergement permanent (Railway recommandé pour rapidité de mise en place)
- Modèle de diagnostic spécialisé (plutôt que Gemini généraliste) si la précision devient critique

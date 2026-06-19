# AGRI-BOT — Frontend Web

Frontend complémentaire à l'assistant WhatsApp AGRI-BOT, construit avec Next.js 14 (App Router), TypeScript et Tailwind CSS.

Ce frontend contient :

- **Landing page** (`/`) — présentation publique du projet
- **Tableau de bord agriculteur** (`/dashboard`) — vue d'ensemble des analyses, parcelles, recommandations
- **Détection de maladies** (`/detection`) — upload de photo, simulation d'analyse IA, résultat de diagnostic
- **Météo agricole** (`/dashboard/meteo`) — prévisions 7 jours et conseils climatiques
- **Assistant conversationnel** (`/dashboard/conseils`) — chat type WhatsApp, fonctionnel en local
- **Carte agricole interactive** (`/dashboard/carte`) — carte Leaflet avec tuiles OpenStreetMap, alertes géolocalisées
- **Mon exploitation** (`/dashboard/exploitation`) — profil, parcelles, calendrier cultural

> ⚠️ Ce livrable est **frontend uniquement**. Toutes les données (diagnostics, météo, alertes) sont mockées dans `lib/mock-data.ts`. Aucun backend, aucune vraie API IA n'est connecté — c'est le point d'intégration à prévoir avec l'équipe backend du hackathon.

## Installation

Prérequis : Node.js 18.18+ (recommandé : 20 LTS)

```bash
cd agribot-frontend
npm install
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

## Build de production

```bash
npm run build
npm run start
```

## Structure du projet

```
agribot-frontend/
├── app/
│   ├── page.tsx                    → Landing page
│   ├── layout.tsx                  → Layout racine (fonts, metadata)
│   ├── globals.css                 → Styles globaux + Tailwind
│   ├── dashboard/
│   │   ├── page.tsx                → Dashboard agriculteur
│   │   ├── meteo/page.tsx          → Météo agricole
│   │   ├── conseils/page.tsx       → Assistant IA (chat)
│   │   ├── carte/page.tsx          → Carte Leaflet
│   │   ├── exploitation/page.tsx   → Profil + parcelles + calendrier
│   │   └── parametres/page.tsx     → Paramètres utilisateur
│   └── detection/page.tsx          → Module de détection de maladies
├── components/
│   ├── Navbar.tsx                  → Barre de navigation (landing)
│   ├── Sidebar.tsx                 → Barre latérale (dashboard)
│   ├── WhatsAppPreview.tsx         → Mockup téléphone (hero landing)
│   ├── DetectionFlow.tsx           → Logique upload + analyse + résultat
│   ├── AdviceChat.tsx              → Chat assistant IA fonctionnel
│   ├── AgriMap.tsx                 → Carte Leaflet (client-only)
│   ├── MetricCard.tsx              → Carte de métrique réutilisable
│   └── Badge.tsx                   → Badges de statut/sévérité
└── lib/
    ├── types.ts                    → Types TypeScript partagés
    └── mock-data.ts                → Toutes les données simulées
```

## Brancher un vrai backend

Le point d'entrée principal pour l'intégration backend est `components/DetectionFlow.tsx` : la fonction `runAnalysis` simule actuellement l'upload et choisit un diagnostic aléatoire dans `lib/mock-data.ts`. Pour connecter une vraie API :

1. Remplacer le `setTimeout` de simulation par un vrai appel `fetch` vers votre endpoint d'analyse d'image (FastAPI, par exemple)
2. Envoyer le fichier réel sélectionné (actuellement seul le nom est capturé) en `FormData`
3. Mapper la réponse de l'API vers le type `Diagnosis` défini dans `lib/types.ts`

Pour la météo et la carte, remplacer `weatherForecast` et `regionAlerts` dans `lib/mock-data.ts` par des appels à votre API météo (OpenWeather, par exemple) et à votre base de signalements.

## Stack technique

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** — charte graphique verte/dorée définie dans `tailwind.config.js`
- **Leaflet + react-leaflet** — carte interactive avec tuiles OpenStreetMap
- **Lucide React** — icônes
- **Recharts** — installé, prêt à l'emploi pour de futurs graphiques (dashboard admin)

## Charte graphique

| Couleur | Hex | Usage |
|---|---|---|
| Vert | `#22C55E` | Accents, succès |
| Vert foncé | `#166534` | Couleur principale (nav, sidebar, boutons) |
| Jaune | `#FACC15` | Call-to-action, accent récolte |
| Crème | `#FAFAF7` | Fond |

Polices : **Sora** (titres, via `font-display`) et **Inter** (corps de texte, par défaut).

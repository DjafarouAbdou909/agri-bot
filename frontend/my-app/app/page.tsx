import Link from 'next/link'
import {
  MessageCircle,
  PlayCircle,
  Microscope,
  CloudRain,
  MessagesSquare,
  MapPin,
  Sprout,
  Star,
  Calendar,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { WhatsAppPreview } from '@/components/WhatsAppPreview'
import { platformStats } from '@/lib/mock-data'

const features = [
  {
    icon: Microscope,
    title: 'Détection de maladies',
    body: 'Photographiez vos plantes et obtenez un diagnostic IA en moins de 2 secondes avec le nom, le niveau de gravité et le traitement.',
  },
  {
    icon: CloudRain,
    title: 'Météo agricole',
    body: 'Prévisions sur 7 jours adaptées à votre zone, avec alertes de sécheresse, d\'inondation et recommandations de traitement.',
  },
  {
    icon: MessagesSquare,
    title: 'Conseils personnalisés',
    body: 'Posez vos questions à AGRI-BOT en français, anglais ou dioula. Conseils en semis, engrais, irrigation et récolte.',
  },
  {
    icon: MapPin,
    title: 'Carte des alertes',
    body: 'Visualisez les zones à risque dans votre région en temps réel et anticipez la propagation des maladies.',
  },
  {
    icon: Sprout,
    title: 'Gestion des parcelles',
    body: 'Suivez chaque parcelle, son historique de maladies, son calendrier cultural et vos statistiques de productivité.',
  },
  {
    icon: MessageCircle,
    title: '100% WhatsApp',
    body: 'Aucune app à installer. Tout fonctionne sur WhatsApp, même avec une connexion limitée ou un téléphone basique.',
  },
]

const steps = [
  { num: 1, title: 'Photographiez', body: 'Prenez une photo de la feuille ou du plant suspect depuis WhatsApp ou l\'application web.' },
  { num: 2, title: 'L\'IA analyse', body: 'Notre modèle de vision analyse l\'image et identifie la maladie avec un score de confiance.' },
  { num: 3, title: 'Recevez le plan', body: 'Un plan de traitement détaillé avec produits disponibles localement et prix en FCFA.' },
  { num: 4, title: 'Suivez les résultats', body: 'AGRI-BOT envoie des rappels et suit l\'évolution de vos parcelles semaine après semaine.' },
]

const testimonials = [
  {
    quote: 'Avant AGRI-BOT, je perdais jusqu\'à 30% de ma récolte de maïs. Maintenant je détecte les maladies en quelques secondes et j\'agis vite.',
    name: 'Kouassi Koffi',
    role: 'Agriculteur · Bouaké',
    initials: 'KK',
  },
  {
    quote: 'Je conseille 80 agriculteurs et AGRI-BOT m\'aide à les suivre tous. La carte des alertes est indispensable pour mon travail de terrain.',
    name: 'Aminata Touré',
    role: 'Agent agricole · Korhogo',
    initials: 'AT',
  },
  {
    quote: 'Simple à utiliser même pour moi qui ne suis pas très techno. J\'envoie juste la photo sur WhatsApp et j\'ai la réponse en 2 secondes.',
    name: 'Fatou Bamba',
    role: 'Cacaocultrice · San-Pédro',
    initials: 'FB',
  },
]

const techStack = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Leaflet']

export default function HomePage() {
  return (
    <main>
      <Navbar />

      <section className="bg-agri-greenDark px-6 pb-0 pt-12 md:px-10 md:pt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-end gap-8 md:flex-row">
          <div className="flex-1 pb-10">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-agri-green" />
              IA agronomique · Disponible sur WhatsApp
            </span>
            <h1 className="font-display text-3xl font-medium leading-tight text-white md:text-[42px]">
              Protégez vos cultures avec{' '}
              <span className="text-agri-gold">l&apos;intelligence artificielle</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
              AGRI-BOT détecte les maladies de vos cultures en quelques secondes, vous
              donne des conseils personnalisés et surveille la météo pour maximiser
              votre récolte.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://wa.me/"
                className="flex items-center gap-2 rounded-lg bg-agri-gold px-5 py-3 text-sm font-medium text-amber-950 transition hover:brightness-105"
              >
                <MessageCircle size={17} />
                Démarrer sur WhatsApp
              </a>
              <button className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15">
                <PlayCircle size={17} />
                Voir la démo
              </button>
            </div>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-xl font-medium text-white">
                  {platformStats.activeFarmers.toLocaleString('fr-FR')}+
                </p>
                <p className="text-[11px] text-white/60">Agriculteurs actifs</p>
              </div>
              <div>
                <p className="text-xl font-medium text-white">{platformStats.aiAccuracy}%</p>
                <p className="text-[11px] text-white/60">Précision IA</p>
              </div>
              <div>
                <p className="text-xl font-medium text-white">{platformStats.responseTime}s</p>
                <p className="text-[11px] text-white/60">Temps de réponse</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 self-end">
            <WhatsAppPreview />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 bg-green-50 px-6 py-10 text-center md:grid-cols-4 md:px-10">
        <div>
          <p className="text-3xl font-medium text-green-900">{platformStats.lossReduction}%</p>
          <p className="mt-1 text-[13px] text-green-800">Réduction des pertes agricoles</p>
        </div>
        <div>
          <p className="text-3xl font-medium text-green-900">{platformStats.detectableDiseases}</p>
          <p className="mt-1 text-[13px] text-green-800">Maladies détectables</p>
        </div>
        <div>
          <p className="text-3xl font-medium text-green-900">7j</p>
          <p className="mt-1 text-[13px] text-green-800">Prévisions météo</p>
        </div>
        <div>
          <p className="text-3xl font-medium text-green-900">{platformStats.supportedLanguages}</p>
          <p className="mt-1 text-[13px] text-green-800">Langues supportées</p>
        </div>
      </section>

      <section id="features" className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-800">
              Fonctionnalités
            </span>
            <h2 className="text-2xl font-medium text-neutral-900">
              Tout ce dont l&apos;agriculteur a besoin
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[13px] text-neutral-500">
              Une suite d&apos;outils intelligents accessible directement depuis WhatsApp
              ou le web, sans formation complexe.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <f.icon size={20} className="text-green-800" />
                </div>
                <h3 className="mb-1.5 text-sm font-medium text-neutral-900">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-neutral-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-neutral-50 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-800">
              Comment ça marche
            </span>
            <h2 className="text-2xl font-medium text-neutral-900">
              Quatre étapes, des résultats immédiats
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-agri-greenDark text-sm font-medium text-white">
                  {s.num}
                </div>
                <h3 className="mb-1 text-[13px] font-medium text-neutral-900">{s.title}</h3>
                <p className="text-[12px] leading-relaxed text-neutral-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-800">
              Témoignages
            </span>
            <h2 className="text-2xl font-medium text-neutral-900">
              Ils font confiance à AGRI-BOT
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="mb-2.5 flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mb-4 text-[13px] italic leading-relaxed text-neutral-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-[11px] font-medium text-green-800">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-neutral-900">{t.name}</p>
                    <p className="text-[11px] text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-agri-greenDark px-6 py-16 text-center md:px-10">
        <h2 className="text-2xl font-medium text-white">Prêt à protéger votre récolte ?</h2>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-white/75">
          Rejoignez {platformStats.activeFarmers.toLocaleString('fr-FR')} agriculteurs qui font
          déjà confiance à AGRI-BOT. Gratuit et accessible depuis WhatsApp.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="https://wa.me/"
            className="flex items-center gap-2 rounded-lg bg-agri-gold px-5 py-3 text-sm font-medium text-amber-950 transition hover:brightness-105"
          >
            <MessageCircle size={17} />
            Démarrer gratuitement
          </a>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15"
          >
            <Calendar size={17} />
            Demander une démo
          </Link>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-12 md:px-10">
        <div className="mb-5 text-center">
          <span className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-800">
            Stack technique
          </span>
          <h2 className="text-xl font-medium text-neutral-900">
            Construit avec des technologies modernes
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {techStack.map((t) => (
            <span
              key={t}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-1.5 text-[12px] text-neutral-600"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 bg-agri-greenDarker px-6 py-6 md:px-10">
        <p className="text-[12px] text-white/45">
          © 2026 AGRI-BOT · Fait avec passion pour l&apos;agriculture africaine
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-[12px] text-white/40 hover:text-white/70">Confidentialité</a>
          <a href="#" className="text-[12px] text-white/40 hover:text-white/70">Conditions</a>
          <a href="#" className="text-[12px] text-white/40 hover:text-white/70">Contact</a>
        </div>
      </footer>
    </main>
  )
}

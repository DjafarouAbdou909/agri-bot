import Link from 'next/link'
import {
  Camera,
  Microscope,
  Sprout,
  AlertTriangle,
  Ruler,
  Lightbulb,
  Droplets,
  CalendarClock,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { MetricCard } from '@/components/MetricCard'
import { StatusBadge } from '@/components/Badge'
import { diagnoses, parcels, farmer } from '@/lib/mock-data'

function healthColor(score: number) {
  if (score >= 85) return 'bg-green-600'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const urgentCount = diagnoses.filter((d) => d.status === 'urgent').length

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-medium text-neutral-900">
              Bonjour, {farmer.name.split(' ')[0]}
            </h1>
            <p className="mt-0.5 text-[12px] text-neutral-500">
              {today.charAt(0).toUpperCase() + today.slice(1)} · {farmer.location}
            </p>
          </div>
          <Link
            href="/detection"
            className="flex items-center gap-2 rounded-lg bg-agri-greenDark px-4 py-2.5 text-[12px] font-medium text-white transition hover:brightness-110"
          >
            <Camera size={15} />
            Nouvelle analyse
          </Link>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
          <MetricCard
            label="Analyses effectuées"
            value={diagnoses.length + 44}
            trend="+5 cette semaine"
            trendColor="text-green-700"
            icon={Microscope}
            iconBg="bg-green-100"
            iconColor="text-green-800"
          />
          <MetricCard
            label="Cultures suivies"
            value={parcels.length}
            trend={parcels.map((p) => p.crop).join(', ')}
            icon={Sprout}
            iconBg="bg-amber-100"
            iconColor="text-amber-800"
          />
          <MetricCard
            label="Alertes actives"
            value={urgentCount}
            trend={urgentCount > 0 ? 'Action requise' : 'Tout est sous contrôle'}
            trendColor={urgentCount > 0 ? 'text-red-700' : 'text-green-700'}
            icon={AlertTriangle}
            iconBg="bg-red-100"
            iconColor="text-red-800"
          />
          <MetricCard
            label="Superficie totale"
            value={`${farmer.totalArea} ha`}
            trend={`${parcels.length} parcelles`}
            icon={Ruler}
            iconBg="bg-blue-100"
            iconColor="text-blue-800"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-medium text-neutral-900">
                Historique des diagnostics
              </h2>
              <Link href="/detection" className="text-[11px] text-green-800 hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="flex flex-col">
              {diagnoses.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 border-b border-neutral-100 py-2.5 last:border-0"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <Sprout size={17} className="text-green-800" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-neutral-900">
                      {d.diseaseName} · {d.parcelName}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {d.date} · Confiance {d.confidence}%
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h2 className="mb-3 text-[13px] font-medium text-neutral-900">Mes parcelles</h2>
              <div className="flex flex-col">
                {parcels.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2.5 border-b border-neutral-100 py-2 last:border-0"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
                      <Sprout size={15} className="text-green-800" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] font-medium text-neutral-900">{p.name}</p>
                      <p className="text-[10px] text-neutral-500">
                        {p.crop} · {p.area} ha
                      </p>
                    </div>
                    <div className="h-1.5 w-12 flex-shrink-0 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full ${healthColor(p.healthScore)}`}
                        style={{ width: `${p.healthScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-4">
              <h2 className="mb-3 text-[13px] font-medium text-neutral-900">
                Recommandations récentes
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-2.5">
                  <Lightbulb size={15} className="mt-0.5 flex-shrink-0 text-amber-700" />
                  <p className="text-[11px] leading-relaxed text-neutral-800">
                    Traiter la rouille du maïs avant demain — humidité élevée prévue
                  </p>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-2.5">
                  <Droplets size={15} className="mt-0.5 flex-shrink-0 text-amber-700" />
                  <p className="text-[11px] leading-relaxed text-neutral-800">
                    Réduire l&apos;irrigation parcelle Sud cette semaine — pluies attendues
                  </p>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-2.5">
                  <CalendarClock size={15} className="mt-0.5 flex-shrink-0 text-amber-700" />
                  <p className="text-[11px] leading-relaxed text-neutral-800">
                    Période idéale de récolte cacao : fin juillet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

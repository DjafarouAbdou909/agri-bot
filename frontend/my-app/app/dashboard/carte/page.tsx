'use client'

import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/Sidebar'
import { regionAlerts } from '@/lib/mock-data'
import type { Severity } from '@/lib/types'

const AgriMap = dynamic(() => import('@/components/AgriMap').then((m) => m.AgriMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-[12px] text-neutral-400">
      Chargement de la carte...
    </div>
  ),
})

const diseases = Array.from(new Set(regionAlerts.map((a) => a.disease)))

const riskDot: Record<Severity, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-600',
}

export default function CartePage() {
  const totalReports = regionAlerts.reduce((sum, a) => sum + a.reportCount, 0)

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-5">
          <h1 className="text-lg font-medium text-neutral-900">Carte agricole interactive</h1>
          <p className="mt-0.5 text-[12px] text-neutral-500">
            Localisation des signalements de maladies en temps réel
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex w-[200px] flex-shrink-0 flex-col gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
              <h2 className="mb-2.5 text-[12px] font-medium text-neutral-900">
                Filtrer par maladie
              </h2>
              <div className="flex flex-col gap-1.5">
                {diseases.map((d) => (
                  <label key={d} className="flex items-center gap-2 text-[12px] text-neutral-800">
                    <input type="checkbox" defaultChecked className="accent-green-700" />
                    {d}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
              <h2 className="mb-2.5 text-[12px] font-medium text-neutral-900">Niveau de risque</h2>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  Critique — action urgente
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Modéré — surveillance
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  Faible — sous contrôle
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="rounded-lg bg-neutral-100 p-2.5">
                <p className="text-[16px] font-medium text-neutral-900">{totalReports}</p>
                <p className="text-[10px] text-neutral-500">Signalements actifs</p>
              </div>
              <div className="rounded-lg bg-neutral-100 p-2.5">
                <p className="text-[16px] font-medium text-neutral-900">{regionAlerts.length}</p>
                <p className="text-[10px] text-neutral-500">Zones surveillées</p>
              </div>
              <div className="rounded-lg bg-neutral-100 p-2.5">
                <p className="text-[16px] font-medium text-neutral-900">4 280</p>
                <p className="text-[10px] text-neutral-500">Exploitations connectées</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-xl border border-neutral-200 bg-white p-3">
            <div className="h-[480px] overflow-hidden rounded-lg">
              <AgriMap />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
          {regionAlerts.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white p-3"
            >
              <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${riskDot[a.riskLevel]}`} />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-neutral-900">{a.disease}</p>
                <p className="text-[10px] text-neutral-500">
                  {a.zone} · {a.reportCount} signalements
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

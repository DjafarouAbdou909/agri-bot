import { Sidebar } from '@/components/Sidebar'
import { DetectionFlow } from '@/components/DetectionFlow'
import { diagnoses } from '@/lib/mock-data'
import { StatusBadge } from '@/components/Badge'
import { Sprout } from 'lucide-react'

export default function DetectionPage() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-5">
          <h1 className="text-lg font-medium text-neutral-900">Détection de maladie</h1>
          <p className="mt-0.5 text-[12px] text-neutral-500">
            Téléversez une photo pour un diagnostic instantané par intelligence artificielle
          </p>
        </div>

        <DetectionFlow />

        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="mb-3 text-[13px] font-medium text-neutral-900">Mes analyses récentes</h2>
          <div className="flex flex-col">
            {diagnoses.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 border-b border-neutral-100 py-2.5 last:border-0"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <Sprout size={19} className="text-green-800" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-neutral-900">
                    {d.cropName} · {d.parcelName}
                  </p>
                  <p className="text-[11px] text-neutral-500">{d.date}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

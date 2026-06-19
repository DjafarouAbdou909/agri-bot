import { Sidebar } from '@/components/Sidebar'
import {
  MapPin,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  AlertTriangle,
  SprayCan,
  SunMedium,
  Droplet,
} from 'lucide-react'
import { weatherForecast } from '@/lib/mock-data'

const conditionIcon = {
  sunny: Sun,
  cloudy: CloudRain,
  rainy: CloudRain,
  stormy: CloudRain,
}

export default function MeteoPage() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-5">
          <h1 className="text-lg font-medium text-neutral-900">Météo agricole</h1>
          <p className="mt-0.5 text-[12px] text-neutral-500">
            Prévisions et conseils adaptés à vos cultures
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl bg-agri-greenDark p-5">
          <div>
            <p className="flex items-center gap-1.5 text-[12px] text-white/75">
              <MapPin size={13} /> Bouaké, Côte d&apos;Ivoire
            </p>
            <p className="mt-1 text-[42px] font-medium leading-none text-white">28°</p>
            <p className="mt-1 text-[12px] text-white/85">Partiellement nuageux</p>
            <div className="mt-3 flex gap-5">
              <div className="text-[11px] text-white/70">
                Humidité<span className="block text-[14px] font-medium text-white">78%</span>
              </div>
              <div className="text-[11px] text-white/70">
                Vent<span className="block text-[14px] font-medium text-white">12 km/h</span>
              </div>
              <div className="text-[11px] text-white/70">
                UV<span className="block text-[14px] font-medium text-white">Élevé</span>
              </div>
            </div>
          </div>
          <CloudRain size={56} className="text-white/85" />
        </div>

        <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-amber-50 p-3.5">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-800" />
          <div>
            <p className="text-[13px] font-medium text-amber-900">Alerte humidité élevée</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-amber-800">
              Conditions favorables à la propagation de maladies fongiques sur maïs et cacao.
              Traitez avant demain matin si symptômes détectés.
            </p>
          </div>
        </div>

        <h2 className="mb-2.5 text-[13px] font-medium text-neutral-900">Prévisions sur 7 jours</h2>
        <div className="mb-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {weatherForecast.map((d, i) => {
            const Icon = conditionIcon[d.condition]
            return (
              <div
                key={d.day}
                className={`rounded-lg border p-2.5 text-center ${
                  i === 0 ? 'border-green-300 bg-green-50' : 'border-neutral-200 bg-white'
                }`}
              >
                <p className="mb-1.5 text-[10px] text-neutral-500">{d.day}</p>
                <Icon size={20} className="mx-auto mb-1.5 text-green-800" />
                <p className="text-[12px] font-medium text-neutral-900">{d.tempMax}°</p>
                <p className="text-[10px] text-neutral-500">{d.tempMin}°</p>
                <p className="mt-1 text-[10px] text-blue-700">{d.rainChance}% pluie</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="mb-2.5 text-[13px] font-medium text-neutral-900">
              Conseils adaptés au climat
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 border-b border-neutral-100 py-1.5 last:border-0">
                <Droplet size={15} className="mt-0.5 flex-shrink-0 text-agri-greenDark" />
                <p className="text-[12px] text-neutral-800">
                  Réduisez l&apos;irrigation parcelle Sud — pluie attendue dimanche
                </p>
              </div>
              <div className="flex items-start gap-2 border-b border-neutral-100 py-1.5 last:border-0">
                <SprayCan size={15} className="mt-0.5 flex-shrink-0 text-agri-greenDark" />
                <p className="text-[12px] text-neutral-800">
                  Traitez avant demain — humidité favorable aux champignons
                </p>
              </div>
              <div className="flex items-start gap-2 border-b border-neutral-100 py-1.5 last:border-0">
                <SunMedium size={15} className="mt-0.5 flex-shrink-0 text-agri-greenDark" />
                <p className="text-[12px] text-neutral-800">
                  Protégez les jeunes plants de l&apos;indice UV élevé en journée
                </p>
              </div>
              <div className="flex items-start gap-2 py-1.5">
                <Wind size={15} className="mt-0.5 flex-shrink-0 text-agri-greenDark" />
                <p className="text-[12px] text-neutral-800">
                  Évitez la pulvérisation entre 11h et 15h — vent et chaleur
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="mb-2.5 text-[13px] font-medium text-neutral-900">
              Détails atmosphériques
            </h2>
            <div className="flex flex-col">
              {[
                { label: 'Humidité', icon: Droplets, value: '78%' },
                { label: 'Vent', icon: Wind, value: '12 km/h NE' },
                { label: 'Lever du soleil', icon: Sun, value: '06:12' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between border-b border-neutral-100 py-2 last:border-0"
                >
                  <span className="flex items-center gap-1.5 text-[12px] text-neutral-500">
                    <row.icon size={15} /> {row.label}
                  </span>
                  <span className="text-[12px] font-medium text-neutral-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

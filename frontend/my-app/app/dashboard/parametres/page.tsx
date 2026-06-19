import { Sidebar } from '@/components/Sidebar'
import { farmer } from '@/lib/mock-data'

export default function ParametresPage() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-5">
          <h1 className="text-lg font-medium text-neutral-900">Paramètres</h1>
          <p className="mt-0.5 text-[12px] text-neutral-500">Gérez votre profil et vos préférences</p>
        </div>

        <div className="max-w-md rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-neutral-700">
                Nom complet
              </label>
              <input
                defaultValue={farmer.name}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[13px] outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-neutral-700">
                Localisation
              </label>
              <input
                defaultValue={farmer.location}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[13px] outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-neutral-700">
                Langue préférée
              </label>
              <select className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[13px] outline-none focus:border-green-500">
                <option>Français</option>
                <option>English</option>
                <option>Dioula</option>
              </select>
            </div>
            <button className="mt-1 rounded-lg bg-agri-greenDark py-2.5 text-[13px] font-medium text-white transition hover:brightness-110">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

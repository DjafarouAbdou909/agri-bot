import { Sidebar } from '@/components/Sidebar'
import { AdviceChat } from '@/components/AdviceChat'

export default function ConseilsPage() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-5">
          <h1 className="text-lg font-medium text-neutral-900">Conseils agronomes</h1>
          <p className="mt-0.5 text-[12px] text-neutral-500">
            Posez vos questions à AGRI-BOT en français, anglais ou dioula
          </p>
        </div>

        <AdviceChat />
      </main>
    </div>
  )
}

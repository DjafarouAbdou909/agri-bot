import { Sprout, AlertTriangle } from 'lucide-react'

export function WhatsAppPreview() {
  return (
    <div className="w-[220px] rounded-t-[28px] border-[6px] border-b-0 border-agri-greenDarker bg-agri-greenDarker p-2">
      <div className="mb-1 flex items-center gap-1.5 rounded-md bg-[#128C7E] px-2 py-1.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
          <Sprout size={11} className="text-white" />
        </div>
        <span className="text-[10px] font-medium text-white">AGRI-BOT · En ligne</span>
      </div>
      <div className="flex min-h-[180px] flex-col gap-1.5 rounded-b-md bg-[#ECE5DD] p-1.5">
        <div className="max-w-[85%] rounded-tl-sm rounded-r-lg rounded-bl-lg bg-white px-2 py-1.5 text-[10px] leading-snug text-neutral-900">
          Bonjour ! Envoyez une photo de votre culture pour une analyse instantanée.
        </div>
        <div className="self-end rounded-tr-sm rounded-l-lg rounded-br-lg bg-[#DCF8C6] px-2 py-1.5 text-[10px] text-neutral-900">
          📷 feuille_mais.jpg
        </div>
        <div className="max-w-[85%] rounded-tl-sm rounded-r-lg rounded-bl-lg bg-white px-2 py-1.5 text-[10px] text-neutral-500">
          Analyse en cours...
        </div>
        <div className="max-w-[92%] rounded-r-lg border-l-2 border-red-500 bg-white px-2 py-1.5">
          <div className="flex items-center gap-1 text-[9px] font-medium text-red-700">
            <AlertTriangle size={10} />
            Rouille du maïs · 94%
          </div>
          <p className="mt-0.5 text-[9px] leading-snug text-neutral-700">
            Mancozèbe 2g/L demain matin. Dispo Agri-Coop ~1200 FCFA/kg
          </p>
        </div>
        <div className="self-end rounded-tr-sm rounded-l-lg rounded-br-lg bg-[#DCF8C6] px-2 py-1.5 text-[10px] text-neutral-900">
          Merci !
        </div>
      </div>
    </div>
  )
}

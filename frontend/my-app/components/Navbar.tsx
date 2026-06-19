import Link from 'next/link'
import { Sprout } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between bg-agri-greenDark px-6 md:px-10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-agri-green">
          <Sprout size={20} className="text-agri-greenDark" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[15px] font-medium leading-tight text-white">AGRI-BOT</p>
          <p className="text-[10px] leading-tight text-white/60">Assistant agronomique IA</p>
        </div>
      </div>

      <div className="hidden gap-7 md:flex">
        <a href="#features" className="text-sm text-white/80 transition hover:text-white">
          Fonctionnalités
        </a>
        <a href="#how-it-works" className="text-sm text-white/80 transition hover:text-white">
          Comment ça marche
        </a>
        <a href="#testimonials" className="text-sm text-white/80 transition hover:text-white">
          Témoignages
        </a>
        <Link href="/dashboard" className="text-sm text-white/80 transition hover:text-white">
          Tableau de bord
        </Link>
      </div>

      <Link
        href="/dashboard"
        className="rounded-lg bg-agri-gold px-4 py-2 text-sm font-medium text-amber-950 transition hover:brightness-105"
      >
        Commencer gratuitement
      </Link>
    </nav>
  )
}

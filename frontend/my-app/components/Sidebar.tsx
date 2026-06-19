'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  Sprout,
  LayoutDashboard,
  Camera,
  CloudSun,
  MessagesSquare,
  MapPin,
  Sprout as PlantIcon,
  Settings,
} from 'lucide-react'
import { farmer } from '@/lib/mock-data'

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/detection', label: 'Détection', icon: Camera },
  { href: '/dashboard/meteo', label: 'Météo', icon: CloudSun },
  { href: '/dashboard/conseils', label: 'Assistant IA', icon: MessagesSquare },
  { href: '/dashboard/carte', label: 'Carte agricole', icon: MapPin },
  { href: '/dashboard/exploitation', label: 'Mon exploitation', icon: PlantIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-[200px] flex-shrink-0 flex-col gap-1 bg-agri-greenDark p-3">
      <Link href="/" className="mb-4 flex items-center gap-2 px-2 py-1">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-agri-green">
          <Sprout size={17} className="text-agri-greenDark" strokeWidth={2.2} />
        </div>
        <span className="text-sm font-medium text-white">AGRI-BOT</span>
      </Link>

      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-white/65 hover:bg-white/5 hover:text-white/90'
            )}
          >
            <Icon size={17} />
            {item.label}
          </Link>
        )
      })}

      <Link
        href="/dashboard/parametres"
        className="mt-auto flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-white/65 transition hover:bg-white/5 hover:text-white/90"
      >
        <Settings size={17} />
        Paramètres
      </Link>

      <div className="flex items-center gap-2 border-t border-white/15 px-1 pt-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-agri-gold text-[11px] font-medium text-amber-950">
          {farmer.initials}
        </div>
        <div className="overflow-hidden">
          <p className="truncate text-[12px] font-medium text-white">
            {farmer.name.split(' ')[0]}
          </p>
          <p className="truncate text-[10px] text-white/55">Agriculteur</p>
        </div>
      </div>
    </aside>
  )
}

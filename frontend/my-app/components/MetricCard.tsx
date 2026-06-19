import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  trend?: string
  trendColor?: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export function MetricCard({
  label,
  value,
  trend,
  trendColor = 'text-neutral-500',
  icon: Icon,
  iconBg,
  iconColor,
}: MetricCardProps) {
  return (
    <div className="rounded-lg bg-neutral-100 p-3.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500">{label}</span>
        <div className={`flex h-6.5 w-6.5 items-center justify-center rounded-md ${iconBg}`}>
          <Icon size={14} className={iconColor} />
        </div>
      </div>
      <p className="text-[22px] font-medium text-neutral-900">{value}</p>
      {trend && <p className={`mt-0.5 text-[10px] ${trendColor}`}>{trend}</p>}
    </div>
  )
}

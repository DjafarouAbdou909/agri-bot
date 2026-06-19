import { clsx } from 'clsx'
import type { DiagnosisStatus, Severity } from '@/lib/types'

const statusStyles: Record<DiagnosisStatus, string> = {
  healthy: 'bg-green-100 text-green-800',
  monitoring: 'bg-amber-100 text-amber-800',
  urgent: 'bg-red-100 text-red-800',
}

const statusLabels: Record<DiagnosisStatus, string> = {
  healthy: 'Sain',
  monitoring: 'Surveillance',
  urgent: 'Risque élevé',
}

const severityStyles: Record<Severity, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800',
}

const severityLabels: Record<Severity, string> = {
  low: 'Faible risque',
  medium: 'Risque modéré',
  high: 'Risque élevé',
}

export function StatusBadge({ status }: { status: DiagnosisStatus }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        severityStyles[severity]
      )}
    >
      {severityLabels[severity]}
    </span>
  )
}

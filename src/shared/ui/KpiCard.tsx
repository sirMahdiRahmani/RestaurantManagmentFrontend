import type { KeyboardEvent, ReactNode } from 'react'
import { Card } from './Card'
import styles from './KpiCard.module.css'

export interface KpiCardProps {
  label: string
  value: ReactNode
  hint?: ReactNode
  onClick?: () => void
}

export function KpiCard({ label, value, hint, onClick }: KpiCardProps) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <Card
      className={[styles.card, onClick ? styles.clickable : ''].join(' ')}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </Card>
  )
}

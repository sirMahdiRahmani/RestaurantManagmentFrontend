import { Card } from '../../../shared/ui'
import styles from './KpiCard.module.css'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  tone?: 'neutral' | 'warn' | 'ok'
  onClick?: () => void
}

export function KpiCard({ label, value, sub, tone = 'neutral', onClick }: KpiCardProps) {
  return (
    <Card>
      <div className={`${styles.card} ${tone !== 'neutral' ? styles[`tone_${tone}`] : ''} ${onClick ? styles.clickable : ''}`} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {sub ? <span className={styles.sub}>{sub}</span> : null}
      </div>
    </Card>
  )
}

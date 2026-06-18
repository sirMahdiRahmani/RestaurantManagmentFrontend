import styles from './Bar.module.css'

export interface BarProps {
  /** 0–1 fill ratio. */
  ratio: number
  tone?: 'accent' | 'ok' | 'warn' | 'danger'
}

/** A single horizontal level bar, e.g. stock-on-hand vs par. */
export function Bar({ ratio, tone = 'accent' }: BarProps) {
  const clamped = Math.min(1, Math.max(0, ratio))
  return (
    <div className={styles.track}>
      <div className={[styles.fill, styles[tone]].join(' ')} style={{ width: `${clamped * 100}%` }} />
    </div>
  )
}

export interface BarlineProps {
  values: number[]
  labels?: string[]
}

/** A simple 7-day-style vertical bar chart. */
export function Barline({ values, labels }: BarlineProps) {
  const max = Math.max(1, ...values)
  return (
    <div className={styles.barline}>
      {values.map((value, index) => (
        <div key={index} className={styles.column}>
          <div className={styles.columnTrack}>
            <div className={styles.columnFill} style={{ height: `${(value / max) * 100}%` }} />
          </div>
          {labels?.[index] ? <span className={styles.columnLabel}>{labels[index]}</span> : null}
        </div>
      ))}
    </div>
  )
}

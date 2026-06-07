import type { HTMLAttributes } from 'react'
import styles from './Pill.module.css'

export type PillTone = 'neutral' | 'accent' | 'ok' | 'warn' | 'danger'

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone
}

export function Pill({ tone = 'neutral', className, ...rest }: PillProps) {
  const classes = [styles.pill, styles[tone], className].filter(Boolean).join(' ')
  return <span className={classes} {...rest} />
}

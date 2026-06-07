import type { HTMLAttributes } from 'react'
import styles from './Skeleton.module.css'

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      {...rest}
    />
  )
}

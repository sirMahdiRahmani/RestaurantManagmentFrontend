import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import styles from './Field.module.css'

export interface FieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string
  error?: string
  children: ReactNode
}

export function Field({ label, error, children, className, ...rest }: FieldProps) {
  return (
    <label className={[styles.field, className].filter(Boolean).join(' ')} {...rest}>
      <span className={styles.label}>{label}</span>
      {children}
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  )
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={[styles.input, className].filter(Boolean).join(' ')} {...rest} />
}

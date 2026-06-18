import styles from './Segmented.module.css'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

export interface SegmentedProps<T extends string> {
  options: Array<SegmentedOption<T>>
  value: T
  onChange: (value: T) => void
  'aria-label'?: string
}

export function Segmented<T extends string>({ options, value, onChange, ...rest }: SegmentedProps<T>) {
  return (
    <div className={styles.segmented} role="tablist" {...rest}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={[styles.segment, option.value === value ? styles.active : ''].join(' ')}
          onClick={() => { onChange(option.value) }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

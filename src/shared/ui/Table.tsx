import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import styles from './Table.module.css'

export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className={styles.scroller}>
      <table className={[styles.table, className].filter(Boolean).join(' ')} {...rest} />
    </div>
  )
}

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />
}

export function TableRow(props: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />
}

export function TableHeaderCell({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={[styles.headerCell, className].filter(Boolean).join(' ')} {...rest} />
}

export function TableCell({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={[styles.cell, className].filter(Boolean).join(' ')} {...rest} />
}

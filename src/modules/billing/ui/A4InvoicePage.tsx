import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, EmptyState, Skeleton, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { useFoods } from '../../menu'
import { useFactor } from '../application/useFactors'
import styles from './A4InvoicePage.module.css'

export function A4InvoicePage() {
  const { factorId } = useParams<{ factorId: string }>()
  const factorQuery = useFactor(factorId ?? null)
  const foodsQuery = useFoods()
  const factor = factorQuery.data
  const foodNameById = useMemo(
    () => new Map((foodsQuery.data ?? []).map((food) => [food.id, food.name])),
    [foodsQuery.data],
  )

  return (
    <div className={styles.page}>
      <div className={styles.actions}>
        <Button variant="primary" onClick={() => { window.print() }}>
          Print
        </Button>
        <Button disabled>Email</Button>
        <Button disabled>PDF</Button>
      </div>

      {factorQuery.isLoading ? (
        <Card>
          <Skeleton style={{ height: 240 }} />
        </Card>
      ) : !factor ? (
        <Card>
          <EmptyState title="Invoice not found" />
        </Card>
      ) : (
        <article className={styles.invoice}>
          <header className={styles.invoiceHeader}>
            <div>
              <h1 className={styles.brand}>RestoOS</h1>
              <p className={styles.brandMeta}>Reg. No. 00-000000 · VAT ID RO000000</p>
            </div>
            <div className={styles.invoiceMeta}>
              <p>
                Invoice <strong>{factor.id}</strong>
              </p>
              <p>{new Date(factor.createdAt).toLocaleString()}</p>
              <p>Table {factor.tableId}</p>
            </div>
          </header>

          <Table aria-label="Invoice lines">
            <TableHead>
              <TableRow>
                <TableHeaderCell scope="col">Item</TableHeaderCell>
                <TableHeaderCell scope="col">Qty</TableHeaderCell>
                <TableHeaderCell scope="col">Unit price</TableHeaderCell>
                <TableHeaderCell scope="col">Line total</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {factor.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{foodNameById.get(line.foodId) ?? line.foodId}</TableCell>
                  <TableCell className="num">{line.qty}</TableCell>
                  <TableCell className="num">{formatMoney(line.unitPrice)}</TableCell>
                  <TableCell className="num">{formatMoney(line.lineTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <dl className={styles.totals}>
            <div className={styles.totalRow}>
              <dt>Subtotal</dt>
              <dd>{formatMoney(factor.subtotal)}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>Service ({factor.servicePct}%)</dt>
              <dd>{formatMoney(Math.round((factor.subtotal * factor.servicePct) / 100))}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>VAT ({factor.vatPct}%)</dt>
              <dd>{formatMoney(Math.round((factor.subtotal * factor.vatPct) / 100))}</dd>
            </div>
            <div className={[styles.totalRow, styles.totalRowGrand].join(' ')}>
              <dt>Total</dt>
              <dd>{formatMoney(factor.total)}</dd>
            </div>
          </dl>

          <div className={styles.signature}>
            <span>Authorized signature</span>
            <div className={styles.signatureLine} />
          </div>
        </article>
      )}
    </div>
  )
}

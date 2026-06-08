import { formatMoney } from '../../../shared/money'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../../../shared/ui'
import { percentageOfCost } from '../domain/cost'
import type { RecipeLine } from '../domain/types'
import styles from './RecipeTable.module.css'

export interface RecipeTableProps {
  lines: RecipeLine[]
  foodCost: number
  onRemove: (ingredientId: string) => void
  pendingIngredientId: string | null
}

export function RecipeTable({ lines, foodCost, onRemove, pendingIngredientId }: RecipeTableProps) {
  return (
    <Table aria-label="Recipe ingredients">
      <TableHead>
        <TableRow>
          <TableHeaderCell scope="col">Ingredient</TableHeaderCell>
          <TableHeaderCell scope="col">Qty / portion</TableHeaderCell>
          <TableHeaderCell scope="col">Unit cost</TableHeaderCell>
          <TableHeaderCell scope="col">Line cost</TableHeaderCell>
          <TableHeaderCell scope="col">% of cost</TableHeaderCell>
          <TableHeaderCell scope="col"></TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {lines.map((line) => {
          const percent = percentageOfCost(line.lineCost, foodCost)
          const isPending = pendingIngredientId === line.ingredientId
          return (
            <TableRow key={line.ingredientId}>
              <TableCell>
                <span style={{ fontWeight: 600 }}>{line.ingredientName}</span>
              </TableCell>
              <TableCell>
                {line.qtyPerPortion} {line.unit}
              </TableCell>
              <TableCell>{formatMoney(line.unitCost)}</TableCell>
              <TableCell>{formatMoney(line.lineCost)}</TableCell>
              <TableCell>
                <span className={styles.percentCell}>
                  <span className={styles.percentBar} aria-hidden="true">
                    <span className={styles.percentFill} style={{ inlineSize: `${Math.round(percent)}%` }} />
                  </span>
                  {percent.toFixed(0)}%
                </span>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className={styles.removeButton}
                  aria-label={`Remove ${line.ingredientName} from the recipe`}
                  disabled={isPending}
                  onClick={() => { onRemove(line.ingredientId) }}
                >
                  ×
                </button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

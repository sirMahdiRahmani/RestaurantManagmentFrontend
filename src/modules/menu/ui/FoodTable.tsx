import { formatMoney } from '../../../shared/money'
import {
  Icon,
  Pill,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../../shared/ui'
import type { Category, Food } from '../domain/types'
import styles from './FoodTable.module.css'

export interface FoodTableProps {
  foods: Food[]
  categoriesById: Map<string, Category>
}

export function FoodTable({ foods, categoriesById }: FoodTableProps) {
  return (
    <Table aria-label="Menu items">
      <TableHead>
        <TableRow>
          <TableHeaderCell scope="col"></TableHeaderCell>
          <TableHeaderCell scope="col">Name</TableHeaderCell>
          <TableHeaderCell scope="col">Category</TableHeaderCell>
          <TableHeaderCell scope="col">Price</TableHeaderCell>
          <TableHeaderCell scope="col">Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {foods.map((food) => {
          const category = categoriesById.get(food.categoryId)
          return (
            <TableRow key={food.id}>
              <TableCell>
                <span className={styles.thumb}>
                  <Icon name="dish" size={18} />
                </span>
              </TableCell>
              <TableCell>
                <span className={styles.name}>{food.name}</span>
              </TableCell>
              <TableCell>
                {category ? (
                  <Pill tone="neutral">
                    <span aria-hidden="true">{category.emoji}</span> {category.name}
                  </Pill>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                <span className={styles.price}>{formatMoney(food.price)}</span>
              </TableCell>
              <TableCell>
                <Pill tone={food.isActive ? 'ok' : 'neutral'}>{food.isActive ? 'Active' : 'Hidden'}</Pill>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

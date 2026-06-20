import type { Food } from '../../menu'
import { formatMoney } from '../../../shared/money'
import styles from './PosBuilderPage.module.css'

export interface ItemGridProps {
  foods: Food[]
  onAdd: (food: Food) => void
}

export function ItemGrid({ foods, onAdd }: ItemGridProps) {
  return (
    <div className={styles.itemGrid}>
      {foods.map((food) => (
        <button key={food.id} type="button" className={styles.itemCard} onClick={() => { onAdd(food) }}>
          <span className={styles.itemName}>{food.name}</span>
          <span className={styles.itemPrice}>{formatMoney(food.price)}</span>
        </button>
      ))}
    </div>
  )
}

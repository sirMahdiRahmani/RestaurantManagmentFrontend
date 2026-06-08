import { useNavigate } from 'react-router-dom'
import { Card, EmptyState, Pill, Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { useFoods } from '../../menu'
import styles from './RecipesPage.module.css'

export function RecipesPage() {
  const navigate = useNavigate()
  const foodsQuery = useFoods()
  const foods = foodsQuery.data ?? []

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Recipes</h1>
        <p className={styles.subtitle}>Pick a dish to build its recipe and see live cost &amp; margin.</p>
      </header>

      <Card>
        {foodsQuery.isLoading ? (
          <div className={styles.skeletonStack}>
            <Skeleton style={{ height: 52 }} />
            <Skeleton style={{ height: 52 }} />
            <Skeleton style={{ height: 52 }} />
          </div>
        ) : foods.length === 0 ? (
          <EmptyState title="No dishes yet" description="Add dishes in the Menu module before building their recipes." />
        ) : (
          <ul className={styles.list}>
            {foods.map((food) => (
              <li key={food.id}>
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => { navigate(`/recipes/${food.id}`) }}
                >
                  <span className={styles.rowName}>{food.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>{formatMoney(food.price)}</span>
                    <Pill tone={food.isActive ? 'ok' : 'neutral'}>{food.isActive ? 'Active' : 'Hidden'}</Pill>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

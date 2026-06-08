import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, Skeleton } from '../../../shared/ui'
import { useRecipe, useRemoveRecipeLine, useUpsertRecipeLine } from '../application/useRecipe'
import { AddIngredientRow } from './AddIngredientRow'
import { CostSummary } from './CostSummary'
import { RecipeTable } from './RecipeTable'
import styles from './FoodEditorPage.module.css'

export function FoodEditorPage() {
  const navigate = useNavigate()
  const { foodId = '' } = useParams<{ foodId: string }>()
  const recipeQuery = useRecipe(foodId)
  const upsertLine = useUpsertRecipeLine(foodId)
  const removeLine = useRemoveRecipeLine(foodId)
  const [pendingIngredientId, setPendingIngredientId] = useState<string | null>(null)

  const detail = recipeQuery.data

  function handleRemove(ingredientId: string) {
    setPendingIngredientId(ingredientId)
    removeLine.mutate(ingredientId, { onSettled: () => { setPendingIngredientId(null) } })
  }

  function handleAdd(input: { ingredientId: string; qtyPerPortion: number; unit: string }) {
    setPendingIngredientId(input.ingredientId)
    upsertLine.mutate(input, { onSettled: () => { setPendingIngredientId(null) } })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{detail ? `${detail.name} — Recipe` : 'Recipe'}</h1>
          <p className={styles.subtitle}>Build the ingredient list and watch food cost &amp; margin update live.</p>
        </div>
        <Button variant="secondary" onClick={() => { navigate('/recipes') }}>
          ← Back to recipes
        </Button>
      </header>

      {recipeQuery.isLoading ? (
        <div className={styles.skeletonStack}>
          <Skeleton style={{ height: 88 }} />
          <Skeleton style={{ height: 44 }} />
          <Skeleton style={{ height: 44 }} />
          <Skeleton style={{ height: 44 }} />
        </div>
      ) : !detail ? (
        <EmptyState title="Dish not found" description="This dish may have been removed from the menu." />
      ) : (
        <>
          <CostSummary price={detail.price} foodCost={detail.foodCost} margin={detail.margin} />

          <Card>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>
              {detail.recipe.length === 0 ? (
                <EmptyState title="No ingredients yet" description="Add ingredients below to start costing this dish." />
              ) : (
                <RecipeTable
                  lines={detail.recipe}
                  foodCost={detail.foodCost}
                  onRemove={handleRemove}
                  pendingIngredientId={pendingIngredientId}
                />
              )}
              <AddIngredientRow
                existingIngredientIds={detail.recipe.map((line) => line.ingredientId)}
                onAdd={handleAdd}
                isPending={upsertLine.isPending}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Button, Field, Input } from '../../../shared/ui'
import { useIngredients } from '../../inventory'
import styles from './AddIngredientRow.module.css'

export interface AddIngredientRowProps {
  existingIngredientIds: string[]
  onAdd: (input: { ingredientId: string; qtyPerPortion: number; unit: string }) => void
  isPending: boolean
}

export function AddIngredientRow({ existingIngredientIds, onAdd, isPending }: AddIngredientRowProps) {
  const ingredientsQuery = useIngredients()
  const ingredients = ingredientsQuery.data ?? []

  const [ingredientId, setIngredientId] = useState('')
  const [qty, setQty] = useState('')

  const selected = ingredients.find((item) => item.id === ingredientId)
  const canAdd = ingredientId !== '' && Number(qty) > 0 && !isPending

  function handleAdd() {
    if (!selected || !canAdd) return
    onAdd({ ingredientId: selected.id, qtyPerPortion: Number(qty), unit: selected.unit })
    setIngredientId('')
    setQty('')
  }

  return (
    <div className={styles.row}>
      <Field label="Add ingredient">
        <select
          className={styles.select}
          value={ingredientId}
          onChange={(event) => { setIngredientId(event.target.value) }}
        >
          <option value="">Select…</option>
          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id} disabled={existingIngredientIds.includes(ingredient.id)}>
              {ingredient.name}
              {existingIngredientIds.includes(ingredient.id) ? ' (already in recipe)' : ''}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Qty per portion">
        <Input type="number" step="any" min="0" value={qty} onChange={(event) => { setQty(event.target.value) }} />
      </Field>
      <Field label="Unit">
        <Input value={selected?.unit ?? ''} disabled placeholder="—" />
      </Field>
      <Button type="button" variant="primary" disabled={!canAdd} onClick={handleAdd}>
        {isPending ? 'Adding…' : 'Add to recipe'}
      </Button>
    </div>
  )
}

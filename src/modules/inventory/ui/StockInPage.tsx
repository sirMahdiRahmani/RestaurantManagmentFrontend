import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button, Card, Field, Input, Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { useIngredients } from '../application/useIngredients'
import { useReceiveStockIn } from '../application/useStockIns'
import styles from './StockInPage.module.css'

const lineSchema = z.object({
  ingredientId: z.string().min(1, 'Pick an ingredient'),
  qty: z.coerce.number().positive('Must be greater than zero'),
  unit: z.string().min(1, 'Required'),
  unitCost: z.coerce.number().nonnegative('Cannot be negative'),
})

const stockInSchema = z.object({
  supplier: z.string().trim().min(2, 'Supplier name is required'),
  occurredOn: z.string().min(1, 'Pick a date'),
  invoiceNo: z.string().trim().optional(),
  lines: z.array(lineSchema).min(1, 'Add at least one line'),
})

type StockInFormInput = z.input<typeof stockInSchema>
type StockInFormOutput = z.output<typeof stockInSchema>

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10)
}

export function StockInPage() {
  const navigate = useNavigate()
  const ingredientsQuery = useIngredients()
  const receiveStockIn = useReceiveStockIn()
  const ingredients = ingredientsQuery.data ?? []

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StockInFormInput, unknown, StockInFormOutput>({
    resolver: zodResolver(stockInSchema),
    defaultValues: {
      supplier: '',
      occurredOn: todayDateOnly(),
      invoiceNo: '',
      lines: [{ ingredientId: '', qty: 1, unit: '', unitCost: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = watch('lines')

  const grandTotal = useMemo(
    () => lines.reduce((sum, line) => sum + Math.round((Number(line.qty) || 0) * (Number(line.unitCost) || 0)), 0),
    [lines],
  )

  const onSubmit = handleSubmit(async (values) => {
    await receiveStockIn.mutateAsync({
      supplier: values.supplier,
      occurredOn: `${values.occurredOn}T00:00:00Z`,
      invoiceNo: values.invoiceNo || undefined,
      lines: values.lines,
    })
    navigate('/inventory')
  })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Record stock-in</h1>
        <p className={styles.subtitle}>
          Receiving a delivery raises on-hand quantities and recomputes weighted-average unit costs.
        </p>
      </header>

      <Card>
        <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className={styles.headerFields}>
            <Field label="Supplier" error={errors.supplier?.message}>
              <Input {...register('supplier')} placeholder="e.g. Fresh Farms Co." />
            </Field>
            <Field label="Date received" error={errors.occurredOn?.message}>
              <Input type="date" {...register('occurredOn')} />
            </Field>
            <Field label="Invoice # (optional)" error={errors.invoiceNo?.message}>
              <Input {...register('invoiceNo')} placeholder="e.g. INV-1042" />
            </Field>
          </div>

          {ingredientsQuery.isLoading ? (
            <Skeleton style={{ height: 120 }} />
          ) : (
            <div className={styles.lines}>
              {fields.map((field, index) => (
                <div className={styles.line} key={field.id}>
                  <Field label="Ingredient" error={errors.lines?.[index]?.ingredientId?.message}>
                    <Controller
                      control={control}
                      name={`lines.${index}.ingredientId`}
                      render={({ field: controllerField }) => (
                        <select
                          className={styles.select}
                          value={controllerField.value}
                          onChange={(event) => {
                            const ingredientId = event.target.value
                            controllerField.onChange(ingredientId)
                            const ingredient = ingredients.find((item) => item.id === ingredientId)
                            if (ingredient) setValue(`lines.${index}.unit`, ingredient.unit)
                          }}
                        >
                          <option value="">Select…</option>
                          {ingredients.map((ingredient) => (
                            <option key={ingredient.id} value={ingredient.id}>
                              {ingredient.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </Field>
                  <Field label="Qty" error={errors.lines?.[index]?.qty?.message}>
                    <Input type="number" step="any" {...register(`lines.${index}.qty`)} />
                  </Field>
                  <Field label="Unit" error={errors.lines?.[index]?.unit?.message}>
                    <Input {...register(`lines.${index}.unit`)} placeholder="kg" />
                  </Field>
                  <Field label="Unit cost" error={errors.lines?.[index]?.unitCost?.message}>
                    <Input type="number" step="any" {...register(`lines.${index}.unitCost`)} />
                  </Field>
                  <span className={styles.lineTotal}>
                    {formatMoney(Math.round((Number(lines[index]?.qty) || 0) * (Number(lines[index]?.unitCost) || 0)))}
                  </span>
                  <button
                    type="button"
                    className={styles.removeButton}
                    aria-label="Remove line"
                    onClick={() => { remove(index) }}
                    disabled={fields.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              {errors.lines?.message ? <span className={styles.error}>{errors.lines.message}</span> : null}
              <Button
                type="button"
                variant="ghost"
                onClick={() => { append({ ingredientId: '', qty: 1, unit: '', unitCost: 0 }) }}
              >
                + Add line
              </Button>
            </div>
          )}

          <div className={styles.footer}>
            <span>
              Grand total: <span className={styles.grandTotal}>{formatMoney(grandTotal)}</span>
            </span>
            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={() => { navigate('/inventory') }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Receiving…' : 'Receive stock'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Card, EmptyState, Field, Input, Skeleton } from '../../../shared/ui'
import { useCategories, useCreateCategory } from '../application/useCategories'
import styles from './CategoriesPage.module.css'

const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  emoji: z.string().trim().max(4).optional(),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex color like #3b5bdb')
    .optional()
    .or(z.literal('')),
})

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>

export function CategoriesPage() {
  const categoriesQuery = useCategories()
  const createCategory = useCreateCategory()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: '', emoji: '', color: '' },
  })

  const categories = categoriesQuery.data ?? []

  const onSubmit = handleSubmit(async (values) => {
    await createCategory.mutateAsync({
      name: values.name,
      emoji: values.emoji || undefined,
      color: values.color || undefined,
    })
    reset()
  })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>Organize the menu into groups guests can browse.</p>
        </div>
      </header>

      <div className={styles.layout}>
        <Card>
          {categoriesQuery.isLoading ? (
            <div className={styles.list}>
              <Skeleton style={{ height: 52 }} />
              <Skeleton style={{ height: 52 }} />
              <Skeleton style={{ height: 52 }} />
            </div>
          ) : categories.length === 0 ? (
            <EmptyState title="No categories yet" description="Create your first category to start building the menu." />
          ) : (
            <ul className={styles.list}>
              {categories.map((category) => (
                <li key={category.id} className={styles.row}>
                  <span className={styles.swatch} style={{ background: `${category.color}1a`, color: category.color }}>
                    <span aria-hidden="true">{category.emoji}</span>
                  </span>
                  <span className={styles.rowName}>{category.name}</span>
                  <span aria-label="Sort order">#{category.sortOrder}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <h2 style={{ margin: 0, fontSize: 16 }}>Add category</h2>
            <Field label="Name" error={errors.name?.message}>
              <Input {...register('name')} placeholder="e.g. Appetizers" />
            </Field>
            <Field label="Emoji" error={errors.emoji?.message}>
              <Input {...register('emoji')} placeholder="🍽️" />
            </Field>
            <Field label="Color" error={errors.color?.message}>
              <Input {...register('color')} placeholder="#3b5bdb" />
            </Field>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add category'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

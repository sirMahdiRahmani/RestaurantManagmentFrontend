import { Card } from './Card'
import { EmptyState } from './EmptyState'

export interface ComingSoonPageProps {
  title: string
  description?: string
}

/**
 * Placeholder for modules not yet implemented (build-order steps 3-8).
 * Intentional — not a missed scaffolding step.
 */
export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <Card>
      <EmptyState
        title={`${title} — coming soon`}
        description={description ?? 'This module is scheduled for a future build-order step.'}
      />
    </Card>
  )
}

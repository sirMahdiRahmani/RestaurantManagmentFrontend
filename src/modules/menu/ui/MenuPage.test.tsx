import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MenuPage } from './MenuPage'

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('MenuPage', () => {
  it('renders seeded foods once loaded', async () => {
    renderWithClient(<MenuPage />)

    expect(await screen.findByText('Ribeye Steak')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
  })

  it('filters foods when a category pill is selected', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    renderWithClient(<MenuPage />)

    await screen.findByText('Ribeye Steak')
    await user.click(screen.getByRole('button', { name: /Drinks/ }))

    expect(await screen.findByText('Espresso')).toBeInTheDocument()
    expect(screen.queryByText('Ribeye Steak')).not.toBeInTheDocument()
  })
})

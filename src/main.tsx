import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './app/routes'
import { AppShell } from './app/layout/AppShell'
import { Providers } from './app/providers'
import './shared/tokens/tokens.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </Providers>
  </StrictMode>,
)

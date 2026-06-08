import { Navigate, Route, Routes } from 'react-router-dom'
import { CategoriesPage, MenuPage } from '../modules/menu'
import { InventoryPage, StockInPage } from '../modules/inventory'
import { ComingSoonPage } from '../shared/ui'

/**
 * Recipes/Billing/Guests/PublicMenu/Analytics render a shared placeholder
 * until their turn in the documented build order (steps 4-8). This is
 * intentional, not missed scaffolding.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu" replace />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/menu/categories" element={<CategoriesPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/inventory/stock-in" element={<StockInPage />} />
      <Route path="/recipes" element={<ComingSoonPage title="Recipes" />} />
      <Route path="/billing" element={<ComingSoonPage title="Billing" />} />
      <Route path="/guests" element={<ComingSoonPage title="Guests" />} />
      <Route path="/public-menu" element={<ComingSoonPage title="Public Menu" />} />
      <Route path="/analytics" element={<ComingSoonPage title="Analytics" />} />
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  )
}

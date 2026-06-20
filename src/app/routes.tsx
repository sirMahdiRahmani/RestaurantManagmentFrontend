import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { CategoriesPage, MenuPage } from '../modules/menu'
import { InventoryPage, StockInPage } from '../modules/inventory'
import { FoodEditorPage, RecipesPage } from '../modules/recipes'
import { A4InvoicePage, PosBuilderPage } from '../modules/billing'
import { GuestsCrmPage } from '../modules/guests'
import { MenuBoard, QrGuestMenu } from '../modules/publicMenu'
import { DashboardPage } from '../modules/analytics'
import { AppShell } from './layout/AppShell'

function BackOfficeLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/public-menu" element={<MenuBoard />} />
      <Route path="/public-menu/qr" element={<QrGuestMenu />} />
      <Route element={<BackOfficeLayout />}>
        <Route path="/" element={<Navigate to="/analytics" replace />} />
        <Route path="/analytics" element={<DashboardPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/categories" element={<CategoriesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/stock-in" element={<StockInPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:foodId" element={<FoodEditorPage />} />
        <Route path="/billing" element={<PosBuilderPage />} />
        <Route path="/billing/factors/:factorId/print" element={<A4InvoicePage />} />
        <Route path="/guests" element={<GuestsCrmPage />} />
        <Route path="*" element={<Navigate to="/analytics" replace />} />
      </Route>
    </Routes>
  )
}

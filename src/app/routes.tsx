import { Navigate, Route, Routes } from 'react-router-dom'
import { CategoriesPage, MenuPage } from '../modules/menu'
import { InventoryPage, StockInPage } from '../modules/inventory'
import { FoodEditorPage, RecipesPage } from '../modules/recipes'
import { PosBuilderPage } from '../modules/billing'
import { GuestsCrmPage, OnboardingForm } from '../modules/guests'
import { PublicMenuPage, MenuBoard, QrGuestMenu } from '../modules/publicMenu'
import { DashboardPage } from '../modules/analytics'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/analytics" replace />} />
      <Route path="/analytics" element={<DashboardPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/menu/categories" element={<CategoriesPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/inventory/stock-in" element={<StockInPage />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/recipes/:foodId" element={<FoodEditorPage />} />
      <Route path="/billing" element={<PosBuilderPage />} />
      <Route path="/guests" element={<GuestsCrmPage />} />
      <Route path="/guests/new" element={<OnboardingForm />} />
      <Route path="/public-menu" element={<PublicMenuPage />} />
      <Route path="/public-menu/board" element={<MenuBoard />} />
      <Route path="/public-menu/qr" element={<QrGuestMenu />} />
      <Route path="*" element={<Navigate to="/analytics" replace />} />
    </Routes>
  )
}

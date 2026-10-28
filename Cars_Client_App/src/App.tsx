import { Route, Routes } from 'react-router'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import CarsPage from './pages/CarsPage'
import CreateCarPage from './pages/CreateCarPage'
import CarsDetailsPage from './pages/CarsDetailsPage'
import EditCarPage from './pages/EditCarPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
      <Route index element={<HomePage />} />

      <Route path="cars">
        <Route index element={<CarsPage />} />
        <Route path="new" element={<CreateCarPage />} />
        <Route path=":id" element={<CarsDetailsPage />} />
        <Route path=":id/edit" element={<EditCarPage />} />
      </Route>

    <Route path="*" element={<NotFoundPage />} />
    </Route>
    </Routes>
  )
}

export default App

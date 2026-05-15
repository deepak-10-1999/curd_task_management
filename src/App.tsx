import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './components/DashboardPage'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  )
}

export default App

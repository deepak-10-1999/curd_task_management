import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

interface ProtectedRouteProps {
  children: ReactElement
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useAppSelector((state) => state.auth.token)
  return token ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute

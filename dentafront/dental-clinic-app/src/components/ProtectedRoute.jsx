import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FullPageSpinner } from "./Spinner"

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: userRole, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageSpinner />

  if (!isAuthenticated) {
    const redirect = role === "DOCTOR" ? "/doctor" : "/login"
    return <Navigate to={redirect} state={{ from: location }} replace />
  }

  if (role && userRole !== role) {
    const home = userRole === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard"
    return <Navigate to={home} replace />
  }

  return children
}

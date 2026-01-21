import { Navigate, Outlet } from "react-router"
import { useAuth } from "@/contexts/Authcontext"
import { Spinner } from "@/components/ui/spinner"

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  // Warten bis Auth-Status geprüft wurde
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  // not logged in -> login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

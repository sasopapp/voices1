import { Navigate } from "react-router-dom"
import { useSessionContext } from "@supabase/auth-helpers-react"

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext()

  console.log("AuthRoute - Session status:", { session, isLoading })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!session) {
    console.log("No session found, redirecting to login")
    return <Navigate to="/login" replace />
  }

  console.log("Session found, rendering protected content")
  return <>{children}</>
}
import { Navigate } from "react-router-dom"
import { useSessionContext } from "@supabase/auth-helpers-react"

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSessionContext()

  if (session) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
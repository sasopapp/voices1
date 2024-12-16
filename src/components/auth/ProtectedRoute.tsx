import { Navigate } from "react-router-dom"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading: sessionLoading } = useSessionContext()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) {
        console.log('No session or user ID found')
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      try {
        console.log('Checking admin status for user:', session.user.id)
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)

        if (error) {
          console.error('Error fetching profile:', error)
          toast.error('Error checking admin status')
          setIsAdmin(false)
          setIsLoading(false)
          return
        }

        if (!profiles || profiles.length === 0) {
          console.log('No profile found for user')
          setIsAdmin(false)
          setIsLoading(false)
          return
        }

        const profile = profiles[0]
        console.log('Profile data:', profile)
        setIsAdmin(profile?.is_admin || false)
        setIsLoading(false)
      } catch (error) {
        console.error('Error in admin check:', error)
        toast.error('Error checking admin status')
        setIsAdmin(false)
        setIsLoading(false)
      }
    }

    if (!sessionLoading) {
      checkAdminStatus()
    }
  }, [session?.user?.id, sessionLoading])

  if (sessionLoading || isLoading) {
    console.log('Loading admin status...')
    return <div>Loading...</div>
  }

  if (!session) {
    console.log('No session, redirecting to login')
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    console.log('User is not admin, redirecting to home')
    return <Navigate to="/" replace />
  }

  console.log('User is admin, rendering protected content')
  return <>{children}</>
}
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { SessionContextProvider, useSessionContext } from "@supabase/auth-helpers-react"
import Index from "./pages/Index"
import ArtistDetail from "./pages/ArtistDetail"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminNewArtist from "./pages/AdminPage"
import Login from "./pages/Login"
import { supabase } from "./integrations/supabase/client"
import { useEffect, useState } from "react"

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSessionContext()
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
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          setIsAdmin(false)
          setIsLoading(false)
          return
        }

        console.log('Profile data:', profile)
        setIsAdmin(profile?.is_admin || false)
        setIsLoading(false)
      } catch (error) {
        console.error('Error in admin check:', error)
        setIsAdmin(false)
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [session?.user?.id])

  if (isLoading) {
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

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSessionContext()

  if (session) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={null}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } 
            />
            <Route path="/" element={<Index />} />
            <Route path="/artist/:id" element={<ArtistDetail />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/new" 
              element={
                <ProtectedRoute>
                  <AdminNewArtist />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
)

export default App
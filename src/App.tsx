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
      console.log('Starting admin status check')
      
      if (!session?.user?.id) {
        console.log('No session or user ID found, redirecting to login')
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      try {
        console.log('Fetching profile for user:', session.user.id)
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          setIsAdmin(false)
        } else {
          console.log('Profile data:', profile)
          setIsAdmin(!!profile?.is_admin)  // Convert to boolean explicitly
        }
      } catch (error) {
        console.error('Error in admin check:', error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [session?.user?.id])

  console.log('Protected Route State:', {
    isLoading,
    hasSession: !!session,
    isAdmin,
    userId: session?.user?.id
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!session) {
    console.log('No session found, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // Only redirect if we're certain the user is not an admin
  if (isAdmin === false) {
    console.log('User is not admin, redirecting to home')
    return <Navigate to="/" replace />
  }

  // If isAdmin is true, render the protected content
  if (isAdmin === true) {
    console.log('Rendering protected content - user is admin')
    return <>{children}</>
  }

  // If we're still not sure about admin status, show loading
  return <div>Verifying admin status...</div>
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
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
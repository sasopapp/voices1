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
  const { session, isLoading } = useSessionContext()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checkingAdmin, setCheckingAdmin] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session) {
        setCheckingAdmin(false)
        return
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()

        setIsAdmin(profile?.is_admin || false)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
      
      setCheckingAdmin(false)
    }

    checkAdminStatus()
  }, [session])

  if (isLoading || checkingAdmin) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <Navigate to="/login" />
  }

  if (!isAdmin) {
    return <Navigate to="/" />
  }

  return <>{children}</>
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
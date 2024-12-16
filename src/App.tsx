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

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return <Navigate to="/login" />
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
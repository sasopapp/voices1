import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { supabase } from "./integrations/supabase/client"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthRoute } from "./components/auth/AuthRoute"
import { useInitializeSession } from "./hooks/useInitializeSession"

// Pages
import Index from "./pages/Index"
import ArtistDetail from "./pages/ArtistDetail"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminNewArtist from "./pages/AdminPage"
import AdminLanguages from "./pages/admin/AdminLanguages"
import Login from "./pages/Login"
import LanguagePage from "./pages/LanguagePage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  const initialSession = useInitializeSession()

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={initialSession}
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
              <Route path="/language/:language" element={<LanguagePage />} />
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
              <Route 
                path="/admin/languages" 
                element={
                  <ProtectedRoute>
                    <AdminLanguages />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  )
}

export default App
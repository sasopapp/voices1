import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"

interface HeaderProps {
  isAdmin?: boolean
  isLoggedIn?: boolean
}

export const Header = ({ isAdmin, isLoggedIn }: HeaderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const { data: languages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages for header dropdown...')
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      console.log('Languages loaded:', data)
      return data
    },
    enabled: isAdmin && isAdminRoute // Only fetch if user is admin and on admin route
  })

  const handleLogout = async () => {
    console.log('Starting logout process...')
    try {
      // Extract project reference from Supabase URL
      const projectRef = supabase.supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1]
      
      // First, try to sign out normally
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during logout:', error)
        // If the error is session_not_found, we can consider the user already logged out
        if (error.message.includes('session_not_found')) {
          console.log('Session already expired, cleaning up...')
          // Clear any remaining session data from localStorage
          if (projectRef) {
            localStorage.removeItem('sb-' + projectRef + '-auth-token')
          }
          toast.success('Logged out successfully')
          window.location.href = '/' // Force a full page refresh
          return
        }
        toast.error('Error logging out')
      } else {
        console.log('Logout successful')
        toast.success('Logged out successfully')
        window.location.href = '/' // Force a full page refresh
      }
    } catch (error) {
      console.error('Error during logout:', error)
      // If we catch any error, we should still try to clean up
      const projectRef = supabase.supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1]
      if (projectRef) {
        localStorage.removeItem('sb-' + projectRef + '-auth-token')
      }
      toast.error('Error during logout, please refresh the page')
      window.location.href = '/' // Force a full page refresh
    }
  }

  return (
    <header className="border-b bg-white relative z-10">
      <div className="flex h-16 items-center px-6">
        <div className="flex-1" />

        <div className="flex justify-center">
          <img 
            src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png"
            alt="Authentic Voices Logo"
            className="h-24 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {/* Language Pages Dropdown - Only show for admin users on admin routes */}
          {isAdmin && isAdminRoute && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Language Pages
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.name}
                    onClick={() => navigate(`/language/${encodeURIComponent(lang.name.toLowerCase())}`)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isLoggedIn && (
            <>
              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link to="/admin">Admin Dashboard</Link>
                </Button>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* Only show language options for admin users on admin routes */}
              {isAdmin && isAdminRoute && languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.name}
                  onClick={() => navigate(`/language/${encodeURIComponent(lang.name.toLowerCase())}`)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
              {isLoggedIn && (
                <>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
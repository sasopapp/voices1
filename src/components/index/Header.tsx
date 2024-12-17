import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useSessionContext } from "@supabase/auth-helpers-react"

interface HeaderProps {
  isAdmin: boolean
  isLoggedIn: boolean
}

export const Header = ({ isAdmin, isLoggedIn }: HeaderProps) => {
  const navigate = useNavigate()
  const { session } = useSessionContext()

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...')
      
      if (!session) {
        console.log('No active session found, redirecting to login')
        navigate('/login')
        return
      }

      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during logout:', error)
        
        // If the error is due to session not found, we can safely proceed
        if (error.message.includes('session_not_found')) {
          console.log('Session already expired, proceeding with navigation')
          navigate('/login')
          toast.success('Logged out successfully')
          return
        }
        
        toast.error('Error during logout')
        return
      }

      console.log('Logout successful')
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Error during logout:', error)
      toast.error('Error during logout')
    }
  }

  return (
    <header className="border-b relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="w-32">
            {/* Empty div to maintain layout */}
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png" 
              alt="Authentic Voices Logo" 
              className="h-24"
              onClick={() => navigate('/')}
            />
          </div>

          <nav className="flex items-center gap-4">
            {isAdmin && (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Button>
            )}
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
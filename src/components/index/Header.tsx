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
      
      // First check if we have an active session
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (!currentSession) {
        console.log('No active session found, redirecting to index')
        navigate('/')
        window.location.reload()
        toast.success('Logged out successfully')
        return
      }

      // Attempt to sign out with the active session
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during logout:', error)
        
        // If session not found, consider it a successful logout
        if (error.message?.toLowerCase().includes('session not found')) {
          console.log('Session not found, considering as logged out')
          navigate('/')
          window.location.reload()
          toast.success('Logged out successfully')
          return
        }
        
        // For other errors, try one more time to sign out
        try {
          await supabase.auth.signOut()
          navigate('/')
          window.location.reload()
          toast.success('Logged out successfully')
        } catch (retryError) {
          console.error('Error during logout retry:', retryError)
          toast.error('Error during logout')
        }
        return
      }

      console.log('Logout successful')
      toast.success('Logged out successfully')
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error('Unexpected error during logout:', error)
      // Try to sign out one last time in case of unexpected errors
      try {
        await supabase.auth.signOut()
      } catch (finalError) {
        console.error('Final logout attempt failed:', finalError)
      }
      toast.error('Error during logout')
      navigate('/')
      window.location.reload()
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
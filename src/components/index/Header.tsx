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
      
      // If there's no session, just clear local state and redirect
      if (!session) {
        console.log('No active session found, clearing local state')
        await supabase.auth.clearSession()
        navigate('/login')
        toast.success('Logged out successfully')
        return
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during logout:', error)
        
        // Handle session-related error cases
        if (error.message?.toLowerCase().includes('session not found') || 
            error.message?.toLowerCase().includes('body stream already read') ||
            error.message?.toLowerCase().includes('jwt expired') ||
            error.message?.toLowerCase().includes('invalid session')) {
          console.log('Session already expired or invalid, clearing local state')
          await supabase.auth.clearSession()
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
      console.error('Unexpected error during logout:', error)
      // Clear local session state in case of errors
      await supabase.auth.clearSession()
      toast.error('Error during logout')
      navigate('/login')
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
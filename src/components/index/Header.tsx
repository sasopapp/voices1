import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface HeaderProps {
  isAdmin: boolean
  isLoggedIn: boolean
}

export const Header = ({ isAdmin, isLoggedIn }: HeaderProps) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during logout:', error)
        toast.error('Error during logout')
        return
      }

      toast.success('Logged out successfully')
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
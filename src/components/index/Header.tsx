import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, Globe } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  isAdmin: boolean
  isLoggedIn: boolean
}

export const Header = ({ isAdmin, isLoggedIn }: HeaderProps) => {
  const navigate = useNavigate()
  const { session } = useSessionContext()

  // Fetch languages for the dropdown
  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages for header dropdown')
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error fetching languages:', error)
        toast.error('Failed to load languages')
        return []
      }
      
      console.log('Languages loaded:', data)
      return data || []
    },
    enabled: isAdmin // Only fetch if user is admin
  })

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during logout:', error)
        toast.error('Error during logout')
        return
      }

      console.log('Logout successful')
      toast.success('Logged out successfully')
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error('Unexpected error during logout:', error)
      toast.error('Error during logout')
    }
  }

  return (
    <header className="border-b bg-white relative z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-4">
            {isAdmin && (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Language Pages
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="w-48 bg-white border rounded-md shadow-lg"
                  >
                    {languages?.map((language) => (
                      <DropdownMenuItem
                        key={language.id}
                        onClick={() => navigate(`/language/${language.name}`)}
                        className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                      >
                        {language.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png" 
              alt="Authentic Voices Logo" 
              className="h-24 cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          <div className="flex items-center">
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
          </div>
        </div>
      </div>
    </header>
  )
}
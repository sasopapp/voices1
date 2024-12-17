import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Logo } from "../Logo"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface HeaderProps {
  isAdmin?: boolean
  isLoggedIn?: boolean
}

export const Header = ({ isAdmin, isLoggedIn }: HeaderProps) => {
  const handleLogout = async () => {
    console.log('Starting logout process...')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error during logout:', error)
        // If it's a session error, we can consider the user logged out anyway
        if (error.message.includes('session_not_found')) {
          toast.success('Logged out successfully')
          return
        }
        toast.error('Error logging out')
      } else {
        toast.success('Logged out successfully')
      }
    } catch (error) {
      console.error('Error during logout:', error)
      toast.error('Error logging out')
    }
  }

  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center relative">
          {/* Left side */}
          <div className="flex-1" />
          
          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Logo />
          </div>
          
          {/* Right side auth buttons */}
          <div className="flex-1 flex justify-end items-center gap-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Button variant="outline" asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </Button>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
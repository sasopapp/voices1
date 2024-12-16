import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { LogOut, Users, Globe } from "lucide-react"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export function AdminSidebar() {
  const navigate = useNavigate()
  const { session } = useSessionContext()

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('Successfully logged out')
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Error logging out')
    }
  }

  return (
    <div className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-full w-52 px-2">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => navigate('/admin')}
              >
                <Users className="h-4 w-4" />
                Artists
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => navigate('/admin')}
              >
                <Globe className="h-4 w-4" />
                Languages
              </Button>
            </div>
          </div>
          <Separator />
          <div className="px-3 py-2">
            <div className="space-y-1">
              {session ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/login')}
                >
                  <LogOut className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
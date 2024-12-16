import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, Users, Globe, Plus } from "lucide-react"

export function AdminHeader({ title }: { title: string }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Go to home page</span>
          </Button>
          
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <div className="flex-1 flex justify-center">
          <img 
            src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png"
            alt="Authentic Voices Logo"
            className="h-16 w-auto absolute top-0"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate('/admin')}
            data-active={location.pathname === '/admin'}
          >
            <Users className="h-4 w-4" />
            Artists
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate('/admin')}
            data-active={location.pathname.includes('languages')}
          >
            <Globe className="h-4 w-4" />
            Languages
          </Button>
          <Button
            onClick={() => navigate('/admin/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Artist
          </Button>
        </div>
      </div>
    </header>
  )
}
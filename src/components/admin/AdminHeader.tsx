import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, Users, Globe } from "lucide-react"

export function AdminHeader({ title }: { title: string }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="border-b">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <Home className="h-4 w-4" />
          <span className="sr-only">Go to home page</span>
        </Button>
        <img 
          src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png"
          alt="Authentic Voices Logo"
          className="h-24 w-auto mr-4"
        />
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <nav className="flex items-center gap-2">
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
        </nav>
      </div>
    </header>
  )
}
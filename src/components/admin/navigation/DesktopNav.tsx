import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Users, Globe, Plus } from "lucide-react"
import { LanguagesDropdown } from "./LanguagesDropdown"

export const DesktopNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="hidden md:flex items-center gap-4">
      <Button
        variant="ghost"
        className={`flex items-center gap-2 ${location.pathname === '/admin' ? 'bg-accent' : ''}`}
        onClick={() => navigate('/admin')}
      >
        <Users className="h-4 w-4" />
        Artists
      </Button>
      <Button
        variant="ghost"
        className={`flex items-center gap-2 ${location.pathname === '/admin/languages' ? 'bg-accent' : ''}`}
        onClick={() => navigate('/admin/languages')}
      >
        <Globe className="h-4 w-4" />
        Languages
      </Button>

      <LanguagesDropdown />

      <Button
        onClick={() => navigate('/admin/new')}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add New Artist
      </Button>
    </div>
  )
}
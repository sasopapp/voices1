import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, Users, Globe, Plus, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function AdminHeader({ title }: { title: string }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Only fetch languages for the dropdown
  const { data: languages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages for header dropdown...')
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      console.log('Languages loaded:', data)
      return data.map(lang => lang.name)
    },
  })

  return (
    <header className="border-b bg-white relative z-10">
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
            className="h-24 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
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

          {/* Language Pages Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language Pages
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {languages.map((language) => (
                <DropdownMenuItem 
                  key={language}
                  onClick={() => navigate(`/language/${encodeURIComponent(language.toLowerCase())}`)}
                >
                  {language}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => navigate('/admin/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Artist
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/admin')}>
                <Users className="mr-2 h-4 w-4" />
                <span>Artists</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/languages')}>
                <Globe className="mr-2 h-4 w-4" />
                <span>Languages</span>
              </DropdownMenuItem>
              {languages.map((language) => (
                <DropdownMenuItem 
                  key={language}
                  onClick={() => navigate(`/language/${encodeURIComponent(language.toLowerCase())}`)}
                >
                  {language}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => navigate('/admin/new')}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add New Artist</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
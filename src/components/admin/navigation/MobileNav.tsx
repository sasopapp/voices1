import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, Users, Globe, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const MobileNav = () => {
  const navigate = useNavigate()

  const { data: languages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages for mobile dropdown...')
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      console.log('Languages loaded:', data)
      return data
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  return (
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
              key={language.id}
              onClick={() => navigate(`/language/${encodeURIComponent(language.name.toLowerCase())}`)}
            >
              {language.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => navigate('/admin/new')}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add New Artist</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
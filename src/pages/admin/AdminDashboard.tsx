import { useQuery } from "@tanstack/react-query"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist, Language } from "@/types/voiceover"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

interface DatabaseArtist {
  id: string
  name: string
  languages: string[]
  audio_demo: string | null
  avatar: string | null
  created_by: string | null
  is_approved: boolean | null
  created_at: string
}

const AdminDashboard = () => {
  const navigate = useNavigate()

  const { data: artists, isLoading, error } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      console.log('Fetching artists as admin...')
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }

      console.log('Artists data:', data)
      
      // Map database response to frontend type
      return (data || []).map((artist: DatabaseArtist): VoiceoverArtist & { is_approved?: boolean } => ({
        id: artist.id,
        name: artist.name,
        languages: artist.languages.filter((lang): lang is Language => 
          ['English', 'Spanish', 'French', 'German', 'Italian'].includes(lang)
        ),
        audioDemo: artist.audio_demo || '',
        avatar: artist.avatar || '',
        created_by: artist.created_by,
        is_approved: artist.is_approved || false,
        created_at: artist.created_at
      }))
    },
  })

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Manage Artists</h1>
            <Button onClick={() => navigate('/admin/new')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Artist
            </Button>
          </div>

          {error && (
            <div className="text-red-500 mb-4">
              Error loading artists: {error.message}
            </div>
          )}

          {isLoading ? (
            <div className="animate-pulse text-gray-500">Loading artists...</div>
          ) : artists && artists.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist) => (
                <AdminArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No artists found</div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AdminDashboard
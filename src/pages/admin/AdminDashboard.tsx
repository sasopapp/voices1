import { useQuery } from "@tanstack/react-query"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { LanguageManager } from "@/components/admin/LanguageManager"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist } from "@/types/voiceover"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const { session } = useSessionContext()

  const { data: artists, isLoading, error } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      console.log('Fetching artists as admin...')
      
      if (!session) {
        console.error('No session found')
        throw new Error('Authentication required')
      }

      console.log('Session found:', session.user.id)

      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }

      console.log('Artists data:', data)
      
      return (data || []).map((artist: DatabaseArtist): VoiceoverArtist & { is_approved?: boolean } => ({
        id: artist.id,
        name: artist.name,
        languages: artist.languages,
        audioDemo: artist.audio_demo || '',
        avatar: artist.avatar || '',
        created_by: artist.created_by,
        is_approved: artist.is_approved || false,
        created_at: artist.created_at
      }))
    },
    enabled: !!session
  })

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader title="Admin Dashboard" />
      <main className="flex-1 p-6">
        <Tabs defaultValue="artists" className="w-full">
          <TabsList>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
          </TabsList>

          <TabsContent value="artists" className="mt-6">
            <div className="flex justify-end mb-6">
              <Button onClick={() => navigate('/admin/new')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Artist
              </Button>
            </div>

            {error && (
              <div className="text-red-500 mb-4">
                Error loading artists: {(error as Error).message}
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
          </TabsContent>

          <TabsContent value="languages" className="mt-6">
            <LanguageManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default AdminDashboard

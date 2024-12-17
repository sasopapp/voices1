import { useQuery } from "@tanstack/react-query"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist } from "@/types/voiceover"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { Footer } from "@/components/Footer"

interface DatabaseArtist {
  id: string
  name: string
  languages: string[]
  demos: any[]
  avatar: string | null
  created_by: string | null
  is_approved: boolean | null
  created_at: string
  voice_gender: string | null
  email: string
  firstname: string
  lastname: string
  username: string
}

const AdminDashboard = () => {
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
        .select(`
          *,
          demos (*)
        `)
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
        demos: artist.demos,
        avatar: artist.avatar || '',
        created_by: artist.created_by,
        is_approved: artist.is_approved || false,
        created_at: artist.created_at,
        voice_gender: artist.voice_gender,
        email: artist.email,
        firstname: artist.firstname,
        lastname: artist.lastname,
        username: artist.username
      }))
    },
    enabled: !!session
  })

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader title="Admin Dashboard" />
      <main className="flex-1 p-6">
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
      </main>
      <Footer />
    </div>
  )
}

export default AdminDashboard
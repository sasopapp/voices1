import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { VoiceoverArtist } from "@/types/voiceover"

const AdminDashboard = () => {
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          demos (*)
        `)

      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }

      return data
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Admin Dashboard" />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((artist: VoiceoverArtist & { is_approved?: boolean }) => (
            <AdminArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { VoiceoverArtist } from "@/types/voiceover"

const AdminDashboard = () => {
  const { data: artists, isLoading } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Map the database fields to match our VoiceoverArtist type
      return data.map(artist => ({
        id: artist.id,
        name: artist.name,
        languages: artist.languages,
        audioDemo: artist.audio_demo, // Map audio_demo to audioDemo
        avatar: artist.avatar,
        is_approved: artist.is_approved
      }))
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Manage Artists</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists?.map((artist) => (
              <AdminArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AdminDashboard
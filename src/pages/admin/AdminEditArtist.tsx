import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { supabase } from "@/integrations/supabase/client"
import { ArtistEditForm } from "@/components/admin/ArtistEditForm"
import { VoiceoverArtist } from "@/types/voiceover"

const AdminEditArtist = () => {
  const { id } = useParams()

  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      console.log('Fetching artist details for editing:', id)
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          demos (*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching artist:', error)
        throw error
      }

      // Map database fields to frontend model
      const mappedArtist: VoiceoverArtist = {
        id: data.id,
        name: data.name,
        languages: data.languages,
        demos: data.demos,
        avatar: data.avatar,
        created_by: data.created_by,
        is_approved: data.is_approved,
        created_at: data.created_at,
        voice_gender: data.voice_gender,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username
      }

      console.log('Artist details loaded:', mappedArtist)
      return mappedArtist
    },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Edit Artist" />
      <main className="flex-1 p-8">
        {isLoading ? (
          <div className="animate-pulse text-gray-500">Loading artist details...</div>
        ) : artist ? (
          <ArtistEditForm artist={artist} />
        ) : (
          <div className="text-red-500">Artist not found</div>
        )}
      </main>
    </div>
  )
}

export default AdminEditArtist
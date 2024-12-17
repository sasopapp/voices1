import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { supabase } from "@/integrations/supabase/client"
import { ArtistEditForm } from "@/components/admin/ArtistEditForm"

const AdminEditArtist = () => {
  const { id } = useParams()

  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      console.log('Fetching artist details for editing:', id)
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching artist:', error)
        throw error
      }

      console.log('Artist details loaded:', data)
      return data
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
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ArtistEditForm } from "@/components/admin/ArtistEditForm"
import { useQuery } from "@tanstack/react-query"

const AdminEditArtist = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Fetch available languages
  const { data: availableLanguages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching available languages...')
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      return data.map(lang => lang.name)
    },
  })

  // Fetch artist details
  const { data: artist, isLoading: isLoadingArtist } = useQuery({
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

      return data
    },
  })

  if (isLoadingArtist) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminHeader title="Edit Artist" />
        <main className="flex-1 p-8">
          <div>Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Edit Artist" />
      <main className="flex-1 p-8">
        <div className="max-w-xl mx-auto">
          <ArtistEditForm
            artist={artist}
            availableLanguages={availableLanguages}
            onSuccess={() => navigate('/admin')}
          />
        </div>
      </main>
    </div>
  )
}

export default AdminEditArtist
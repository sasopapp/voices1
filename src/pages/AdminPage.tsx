import { useQuery } from "@tanstack/react-query"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { supabase } from "@/integrations/supabase/client"
import { NewArtistForm } from "@/components/admin/NewArtistForm"
import { Footer } from "@/components/Footer"

const AdminNewArtist = () => {
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

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="New Artist" />
      <main className="flex-1 p-8">
        <NewArtistForm availableLanguages={availableLanguages} />
      </main>
      <Footer />
    </div>
  )
}

export default AdminNewArtist
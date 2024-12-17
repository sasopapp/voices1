import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Footer } from "@/components/Footer"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { ArtistDetailHeader } from "@/components/artist-detail/ArtistDetailHeader"
import { ArtistProfile } from "@/components/artist-detail/ArtistProfile"
import { DemosList } from "@/components/artist-detail/DemosList"

const ArtistDetail = () => {
  const { id } = useParams()
  const { session } = useSessionContext()

  // Query to check if user is admin
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      console.log('Fetching artist details for ID:', id)
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single()

      if (artistError) {
        console.error('Error fetching artist:', artistError)
        throw artistError
      }

      const { data: demos, error: demosError } = await supabase
        .from('demos')
        .select('*')
        .eq('artist_id', id)
        .order('is_main', { ascending: false })

      if (demosError) {
        console.error('Error fetching demos:', demosError)
        throw demosError
      }

      console.log('Artist data:', { ...artistData, demos })
      
      return {
        ...artistData,
        demos
      }
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!artist) {
    return <div className="flex items-center justify-center min-h-screen">Artist not found</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ArtistDetailHeader 
        artistId={artist.id} 
        isAdmin={!!profile?.is_admin} 
      />

      <div className="p-8 flex-1">
        <div className="mx-auto max-w-4xl">
          <ArtistProfile artist={artist} />
          <DemosList demos={artist.demos} />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ArtistDetail
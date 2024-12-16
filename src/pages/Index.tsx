import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { VoiceoverArtist } from "@/types/voiceover"
import { Header } from "@/components/index/Header"
import { ArtistList } from "@/components/index/ArtistList"

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all")
  const { session } = useSessionContext()
  
  // Check if user is admin
  const { data: isAdmin = false } = useQuery({
    queryKey: ['isAdmin', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error checking admin status:', error)
        return false
      }

      return profile?.is_admin || false
    },
    enabled: !!session?.user?.id,
  })

  // Fetch artists based on authentication status
  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ['artists', !!session?.user?.id],
    queryFn: async () => {
      console.log('Starting artists fetch...')
      console.log('Session state:', session ? 'logged in' : 'not logged in')
      
      try {
        let query = supabase
          .from('artists')
          .select('*')
        
        // If not logged in or not admin, only show approved artists
        if (!session?.user?.id || !isAdmin) {
          query = query.eq('is_approved', true)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching artists:', error)
          throw error
        }

        console.log('Query completed')
        console.log('Number of artists found:', data?.length || 0)
        
        if (!data || data.length === 0) {
          console.log('No artists found')
          return []
        }

        const mappedArtists = data.map((artist): VoiceoverArtist => ({
          id: artist.id,
          name: artist.name,
          languages: Array.isArray(artist.languages) ? artist.languages : [],
          audioDemo: artist.audio_demo || '',
          avatar: artist.avatar || '',
          created_by: artist.created_by,
          is_approved: artist.is_approved,
          created_at: artist.created_at
        }))

        console.log('Artists mapped successfully')
        return mappedArtists
      } catch (error) {
        console.error('Unexpected error in artists query:', error)
        throw error
      }
    },
  })

  if (artistsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={isAdmin} isLoggedIn={!!session} />
      <main className="p-8">
        <ArtistList 
          artists={artists}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </main>
    </div>
  )
}

export default Index
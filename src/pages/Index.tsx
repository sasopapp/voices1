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

  // Fetch artists - public query for approved artists
  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      console.log('Starting public artists fetch...')
      console.log('Session state:', session ? 'logged in' : 'not logged in')
      
      try {
        console.log('Executing artists query...')
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('is_approved', true)

        console.log('Query completed')

        if (error) {
          console.error('Error fetching artists:', error.message)
          console.error('Error details:', error)
          throw error
        }

        console.log('Raw artists response:', data)
        console.log('Number of artists found:', data?.length || 0)
        
        if (!data || data.length === 0) {
          console.log('No approved artists found')
          return []
        }

        console.log('Found artists with IDs:', data.map(a => a.id))
        console.log('Artists approval status:', data.map(a => a.is_approved))
        
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

        console.log('Mapped artists:', mappedArtists)
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
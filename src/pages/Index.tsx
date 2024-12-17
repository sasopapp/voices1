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

  // Fetch only approved artists
  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ['approved-artists'],
    queryFn: async () => {
      console.log('Starting approved artists fetch...')
      console.log('Making Supabase query to fetch approved artists...')
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('is_approved', true)

      // Log the raw response
      console.log('Raw Supabase response:', { data, error })

      if (error) {
        console.error('Error fetching approved artists:', error)
        throw error
      }

      console.log('Query completed successfully')
      console.log('Raw data received:', data)
      console.log('Number of approved artists found:', data?.length || 0)

      if (!data || data.length === 0) {
        console.log('No approved artists found in database')
        return []
      }

      // Log each artist being mapped
      const mappedArtists = data.map((artist, index): VoiceoverArtist => {
        console.log(`Mapping artist ${index + 1}:`, artist)
        return {
          id: artist.id,
          name: artist.name,
          languages: Array.isArray(artist.languages) ? artist.languages : [],
          audioDemo: artist.audio_demo,
          avatar: artist.avatar,
          created_by: artist.created_by,
          is_approved: artist.is_approved,
          created_at: artist.created_at
        }
      })

      console.log('Final mapped artists:', mappedArtists)
      return mappedArtists
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
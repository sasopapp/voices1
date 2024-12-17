import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist } from "@/types/voiceover"
import { Header } from "@/components/index/Header"
import { ArtistList } from "@/components/index/ArtistList"
import { Footer } from "@/components/Footer"
import { useSessionContext } from "@supabase/auth-helpers-react"

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all")
  const { session } = useSessionContext()
  
  // Query to check if user is admin
  const { data: profile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      
      return data
    },
    enabled: !!session?.user?.id
  })

  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['all-artists'],
    queryFn: async () => {
      console.log('Starting artists fetch...')
      
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select(`
          *,
          demos (*)
        `)
        .eq('is_approved', true)
      
      if (artistsError) {
        console.error('Error fetching artists:', artistsError)
        throw artistsError
      }
      
      if (!artistsData) {
        console.log('No artists found in database')
        return []
      }
      
      console.log('Number of approved artists found:', artistsData.length)
      
      const mappedArtists = artistsData.map((artist): VoiceoverArtist => ({
        id: artist.id,
        name: artist.name,
        languages: Array.isArray(artist.languages) ? artist.languages : [],
        demos: artist.demos,
        avatar: artist.avatar,
        created_by: artist.created_by,
        is_approved: artist.is_approved,
        created_at: artist.created_at,
        voice_gender: artist.voice_gender,
        email: artist.email,
        firstname: artist.firstname,
        lastname: artist.lastname,
        username: artist.username
      }))
      
      console.log('Mapped approved artists:', mappedArtists)
      return mappedArtists
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header 
        isAdmin={!!profile?.is_admin} 
        isLoggedIn={!!session} 
      />
      <main className="flex-1 p-8">
        <ArtistList 
          artists={artists}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </main>
      <Footer />
    </div>
  )
}

export default Index
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist } from "@/types/voiceover"
import { Header } from "@/components/index/Header"
import { ArtistList } from "@/components/index/ArtistList"
import { useSessionContext } from "@supabase/auth-helpers-react"

const LanguagePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all")
  const { session } = useSessionContext()

  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['artists-by-language', selectedLanguage],
    queryFn: async () => {
      console.log('Fetching artists by language:', selectedLanguage)

      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('is_approved', true)
        .filter('languages', 'cs', selectedLanguage)

      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }

      if (!data) {
        console.log('No artists found for the selected language')
        return []
      }

      console.log('Number of artists found:', data.length)

      const mappedArtists = data.map((artist): VoiceoverArtist => ({
        id: artist.id,
        name: artist.name,
        languages: Array.isArray(artist.languages) ? artist.languages : [],
        audioDemo: artist.audio_demo,
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

      console.log('Mapped artists:', mappedArtists)
      return mappedArtists
    },
    enabled: selectedLanguage !== "all"
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAdmin={!!session?.user?.is_admin} 
        isLoggedIn={!!session} 
      />
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

export default LanguagePage

import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist } from "@/types/voiceover"
import { Header } from "@/components/index/Header"
import { ArtistList } from "@/components/index/ArtistList"
import { useSessionContext } from "@supabase/auth-helpers-react"

const LanguagePage = () => {
  const { language } = useParams()
  const { session } = useSessionContext()
  const decodedLanguage = decodeURIComponent(language || '')
  
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['artists-by-language', decodedLanguage],
    queryFn: async () => {
      console.log('Starting artists fetch for language:', decodedLanguage)
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('is_approved', true)
        .contains('languages', [decodedLanguage])
      
      console.log('Raw Supabase response:', { data, error })
      
      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }
      
      if (!data) {
        console.log('No artists found for language:', decodedLanguage)
        return []
      }
      
      console.log('Number of approved artists found:', data.length)
      
      const mappedArtists = data.map((artist): VoiceoverArtist => ({
        id: artist.id,
        name: artist.name,
        languages: Array.isArray(artist.languages) ? artist.languages : [],
        audioDemo: artist.audio_demo,
        avatar: artist.avatar,
        created_by: artist.created_by,
        is_approved: artist.is_approved,
        created_at: artist.created_at,
        voice_gender: artist.voice_gender
      }))
      
      console.log('Mapped approved artists:', mappedArtists)
      return mappedArtists
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={false} isLoggedIn={!!session} />
      <main className="p-8">
        <ArtistList 
          artists={artists}
          selectedLanguage={decodedLanguage}
          onLanguageChange={() => {}} // Disabled since this is a language-specific page
        />
      </main>
    </div>
  )
}

export default LanguagePage
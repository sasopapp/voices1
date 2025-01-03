import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist } from "@/types/voiceover"
import { Header } from "@/components/index/Header"
import { ArtistList } from "@/components/index/ArtistList"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useParams } from "react-router-dom"
import { Footer } from "@/components/Footer"

const LanguagePage = () => {
  const { language } = useParams()
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">(
    language ? language.charAt(0).toUpperCase() + language.slice(1) : "all"
  )
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
    queryKey: ['artists-by-language', selectedLanguage],
    queryFn: async () => {
      console.log('Fetching artists by language:', selectedLanguage)

      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          demos (*)
        `)
        .eq('is_approved', true)
        .contains('languages', [selectedLanguage])

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
        demos: artist.demos,
        avatar: artist.avatar,
        created_by: artist.created_by,
        is_approved: artist.is_approved,
        created_at: artist.created_at,
        voice_gender: artist.voice_gender,
        email: artist.email,
        firstname: artist.firstname,
        lastname: artist.lastname,
        username: artist.username,
        bio: artist.bio || 'No bio available yet.'
      }))

      console.log('Mapped artists:', mappedArtists)
      return mappedArtists
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAdmin={!!profile?.is_admin} 
        isLoggedIn={!!session} 
      />
      <main className="p-8">
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

export default LanguagePage

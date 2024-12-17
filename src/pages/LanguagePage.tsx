import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist } from "@/types/voiceover"
import { Header } from "@/components/index/Header"
import { ArtistCard } from "@/components/ArtistCard"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { Button } from "@/components/ui/button"
import { User, UserCircle, Users } from "lucide-react"
import { useState } from "react"

const LanguagePage = () => {
  const { language } = useParams()
  const { session } = useSessionContext()
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  
  // Add query to check if user is admin
  const { data: profile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      
      console.log('Fetching user profile for admin check...')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      
      console.log('Profile data:', data)
      return data
    },
    enabled: !!session?.user?.id
  })
  
  const decodedLanguage = decodeURIComponent(language || '').split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
  
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['artists-by-language', decodedLanguage],
    queryFn: async () => {
      console.log('Starting artists fetch for language:', decodedLanguage)
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('is_approved', true)
      
      console.log('Raw Supabase response:', { data, error })
      
      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }
      
      if (!data) {
        console.log('No artists found for language:', decodedLanguage)
        return []
      }
      
      // Filter artists that have the specified language
      const filteredArtists = data.filter(artist => 
        Array.isArray(artist.languages) && 
        artist.languages.some(lang => 
          lang.toLowerCase() === decodedLanguage.toLowerCase() ||
          lang.toLowerCase().includes(decodedLanguage.toLowerCase())
        )
      )
      
      console.log('Number of filtered artists found:', filteredArtists.length)
      
      const mappedArtists = filteredArtists.map((artist): VoiceoverArtist => ({
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
      
      console.log('Mapped filtered artists:', mappedArtists)
      return mappedArtists
    },
  })

  const filteredArtists = artists.filter(artist => {
    if (!selectedGender) return true;
    return artist.voice_gender?.toLowerCase() === selectedGender.toLowerCase();
  });

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
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Professional {decodedLanguage} Voice Over Artists
        </h1>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={selectedGender === null ? "secondary" : "outline"}
            onClick={() => setSelectedGender(null)}
            className="min-w-32"
          >
            <Users className="mr-2" />
            All Voices
          </Button>
          <Button
            variant={selectedGender === "male" ? "secondary" : "outline"}
            onClick={() => setSelectedGender("male")}
            className="min-w-32"
          >
            <User className="mr-2" />
            Male Voices
          </Button>
          <Button
            variant={selectedGender === "female" ? "secondary" : "outline"}
            onClick={() => setSelectedGender("female")}
            className="min-w-32"
          >
            <UserCircle className="mr-2" />
            Female Voices
          </Button>
        </div>

        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sorry, no voices available at the moment. Please contact us and we will help you find a voice for your project.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default LanguagePage
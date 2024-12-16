import { useState } from "react"
import { VoiceoverArtist } from "@/types/voiceover"
import { supabase } from "@/integrations/supabase/client"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Header } from "@/components/index/Header"
import { ArtistList } from "@/components/index/ArtistList"

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all")
  const { session } = useSessionContext()
  const [isAdmin, setIsAdmin] = useState(false)

  // Fetch artists using React Query - now fetching approved artists for all visitors
  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      console.log('Fetching approved artists...')
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching artists:', error)
        toast.error('Failed to load artists')
        throw error
      }

      console.log('Fetched artists:', data)
      
      return data.map((artist): VoiceoverArtist => ({
        id: artist.id,
        name: artist.name,
        languages: Array.isArray(artist.languages) ? artist.languages : [],
        audioDemo: artist.audio_demo || '',
        avatar: artist.avatar || '',
        created_by: artist.created_by,
        is_approved: artist.is_approved,
        created_at: artist.created_at
      }))
    },
  })

  // Check if user is admin - only when session exists
  useQuery({
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

      setIsAdmin(profile?.is_admin || false)
      return profile?.is_admin || false
    },
    enabled: !!session?.user?.id,
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
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { supabase } from "@/integrations/supabase/client"
import { VoiceoverArtist } from "@/types/voiceover"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Users, User, UserCircle } from "lucide-react"
import { LanguageSelect } from "@/components/LanguageSelect"

interface DatabaseArtist {
  id: string
  name: string
  languages: string[]
  demos: any[]
  avatar: string | null
  created_by: string | null
  is_approved: boolean | null
  created_at: string
  voice_gender: string | null
  email: string
  firstname: string
  lastname: string
  username: string
}

const AdminDashboard = () => {
  const { session } = useSessionContext()
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all")
  const [selectedGender, setSelectedGender] = useState<string | null>(null)

  const { data: artists, isLoading, error } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      console.log('Fetching artists as admin...')
      
      if (!session) {
        console.error('No session found')
        throw new Error('Authentication required')
      }

      console.log('Session found:', session.user.id)

      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          demos (*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }

      console.log('Artists data:', data)
      
      return (data || []).map((artist: DatabaseArtist): VoiceoverArtist & { is_approved?: boolean } => ({
        id: artist.id,
        name: artist.name,
        languages: artist.languages,
        demos: artist.demos,
        avatar: artist.avatar || '',
        created_by: artist.created_by,
        is_approved: artist.is_approved || false,
        created_at: artist.created_at,
        voice_gender: artist.voice_gender,
        email: artist.email,
        firstname: artist.firstname,
        lastname: artist.lastname,
        username: artist.username
      }))
    },
    enabled: !!session
  })

  const filteredArtists = artists?.filter((artist) => {
    const matchesLanguage = selectedLanguage === "all" || artist.languages.includes(selectedLanguage)
    const matchesGender = !selectedGender || 
      (artist.voice_gender?.toLowerCase() === selectedGender.toLowerCase())
    return matchesLanguage && matchesGender
  })

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader title="Admin Dashboard" />
      <main className="flex-1 p-6">
        {error && (
          <div className="text-red-500 mb-4">
            Error loading artists: {(error as Error).message}
          </div>
        )}

        <div className="mb-6 flex flex-col items-center gap-4">
          <LanguageSelect value={selectedLanguage} onChange={setSelectedLanguage} />
          
          <div className="flex justify-center gap-4">
            <Button
              variant={selectedGender === null ? "secondary" : "outline"}
              onClick={() => setSelectedGender(null)}
              className="min-w-32"
            >
              <Users className="mr-2 h-4 w-4" />
              All Voices
            </Button>
            <Button
              variant={selectedGender === "male" ? "secondary" : "outline"}
              onClick={() => setSelectedGender("male")}
              className="min-w-32"
            >
              <User className="mr-2 h-4 w-4" />
              Male Voices
            </Button>
            <Button
              variant={selectedGender === "female" ? "secondary" : "outline"}
              onClick={() => setSelectedGender("female")}
              className="min-w-32"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Female Voices
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse text-gray-500">Loading artists...</div>
        ) : filteredArtists && filteredArtists.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArtists.map((artist) => (
              <AdminArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No artists found</div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AdminDashboard
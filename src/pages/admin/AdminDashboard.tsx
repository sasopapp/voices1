import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { VoiceoverArtist } from "@/types/voiceover"
import { LanguageSelect } from "@/components/LanguageSelect"
import { Button } from "@/components/ui/button"
import { Users, User, UserCircle } from "lucide-react"
import { Footer } from "@/components/Footer"

const AdminDashboard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all")
  const [selectedGender, setSelectedGender] = useState<string | null>(null)

  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      console.log('Fetching artists for admin dashboard...')
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          demos (*)
        `)

      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }

      console.log('Artists loaded:', data)
      return data
    },
  })

  const filteredArtists = artists.filter((artist: VoiceoverArtist) => {
    const matchesLanguage = selectedLanguage === "all" || 
      (Array.isArray(artist.languages) && artist.languages.includes(selectedLanguage))
    const matchesGender = !selectedGender || 
      (artist.voice_gender?.toLowerCase() === selectedGender.toLowerCase())
    return matchesLanguage && matchesGender
  })

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Admin Dashboard" />
      <main className="flex-1 p-8">
        <div className="mb-8">          
          <div className="flex flex-col items-center gap-4">
            <LanguageSelect value={selectedLanguage} onChange={setSelectedLanguage} />
            
            <div className="flex justify-center gap-4">
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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtists.map((artist: VoiceoverArtist & { is_approved?: boolean }) => (
            <AdminArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminDashboard
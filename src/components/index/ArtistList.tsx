import { useState } from "react"
import { VoiceoverArtist } from "@/types/voiceover"
import { ArtistCard } from "../ArtistCard"
import { LanguageSelect } from "../LanguageSelect"
import { Button } from "../ui/button"
import { Users, User, UserCircle } from "lucide-react"

interface ArtistListProps {
  artists: VoiceoverArtist[]
  selectedLanguage: string | "all"
  onLanguageChange: (value: string | "all") => void
}

export const ArtistList = ({ 
  artists, 
  selectedLanguage, 
  onLanguageChange 
}: ArtistListProps) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null)

  const filteredArtists = artists.filter((artist) => {
    const matchesLanguage = selectedLanguage === "all" || artist.languages.includes(selectedLanguage)
    const matchesGender = !selectedGender || 
      (artist.voice_gender?.toLowerCase() === selectedGender.toLowerCase())
    return matchesLanguage && matchesGender
  })

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-[#1a365d]">Let us help you find the best voice for your next project</h2>
        <p className="mb-8 text-lg text-gray-600">
          Discover professional voiceover artists in multiple languages. Only real voices, no AI!
        </p>
        <div className="flex flex-col items-center gap-4">
          <LanguageSelect value={selectedLanguage} onChange={onLanguageChange} />
          
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
      
      {filteredArtists.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}
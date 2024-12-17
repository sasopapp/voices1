import { VoiceoverArtist } from "@/types/voiceover"
import { ArtistCard } from "../ArtistCard"
import { LanguageSelect } from "../LanguageSelect"

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
  const filteredArtists = artists.filter((artist) => {
    if (selectedLanguage === "all") return true
    return artist.languages.includes(selectedLanguage)
  })

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-[#1a365d]">Find Your Voice</h2>
        <p className="mb-8 text-lg text-gray-600">
          Discover professional voiceover artists in multiple languages
        </p>
        <div className="flex justify-center">
          <LanguageSelect value={selectedLanguage} onChange={onLanguageChange} />
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
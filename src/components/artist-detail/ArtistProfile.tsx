import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, Mic2 } from "lucide-react"
import { VoiceoverArtist } from "@/types/voiceover"

interface ArtistProfileProps {
  artist: VoiceoverArtist
}

export const ArtistProfile = ({ artist }: ArtistProfileProps) => {
  return (
    <div className="mb-8 flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={artist.avatar || ''} alt={artist.username} />
          <AvatarFallback>{artist.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="mb-2 text-3xl font-bold">@{artist.username}</h1>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              {artist.languages.join(", ")}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mic2 className="h-4 w-4" />
              {artist.voice_gender ? artist.voice_gender.charAt(0).toUpperCase() + artist.voice_gender.slice(1) : "Not specified"}
            </div>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-left">{artist.bio}</p>
    </div>
  )
}
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Mic2 } from "lucide-react";
import { VoiceoverArtist } from "@/types/voiceover";

interface ArtistCardHeaderProps {
  artist: VoiceoverArtist;
}

export const ArtistCardHeader = ({ artist }: ArtistCardHeaderProps) => {
  const languages = Array.isArray(artist.languages) ? artist.languages : [];

  return (
    <div className="flex flex-row items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={artist.avatar || ''} alt={artist.username} />
        <AvatarFallback>{artist.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-lg">@{artist.username}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            {languages.length > 0 ? languages.join(", ") : "No languages specified"}
          </div>
          {artist.voice_gender && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mic2 className="h-4 w-4" />
              {artist.voice_gender.charAt(0).toUpperCase() + artist.voice_gender.slice(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import { VoiceoverArtist } from "../types/voiceover";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Globe, Mic2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  artist: VoiceoverArtist;
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const navigate = useNavigate();

  // Ensure languages is always an array
  const languages = Array.isArray(artist.languages) ? artist.languages : [];

  // Format the voice gender to capitalize first letter
  const formattedGender = artist.voice_gender 
    ? artist.voice_gender.charAt(0).toUpperCase() + artist.voice_gender.slice(1).toLowerCase()
    : "Not specified";

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-lg cursor-pointer" 
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={artist.avatar || ''} alt={artist.name} />
          <AvatarFallback>{artist.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-lg">{artist.name}</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              {languages.length > 0 ? languages.join(", ") : "No languages specified"}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mic2 className="h-4 w-4" />
              {formattedGender}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <audio controls className="w-full">
          <source src={artist.audioDemo || ''} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
    </Card>
  );
};
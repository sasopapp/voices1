import { VoiceoverArtist } from "../types/voiceover";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Globe, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  artist: VoiceoverArtist;
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-lg cursor-pointer" 
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={artist.avatar} alt={artist.name} />
          <AvatarFallback>{artist.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold">{artist.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            {artist.languages.join(", ")}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 rounded-lg bg-secondary p-4">
          <Mic className="h-5 w-5 text-primary" />
          <audio controls className="w-full">
            <source src={artist.audioDemo} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </CardContent>
    </Card>
  );
};
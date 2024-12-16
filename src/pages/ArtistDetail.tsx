import { useParams } from "react-router-dom";
import { voiceoverArtists } from "../data/voiceover-artists";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ArtistDetail = () => {
  const { id } = useParams();
  const artist = voiceoverArtists.find((a) => a.id === id);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  // Adding more demo tracks for the detail page
  const demoTracks = [
    { id: 1, title: "Commercial Demo", url: artist.audioDemo },
    { id: 2, title: "Narrative Demo", url: artist.audioDemo },
    { id: 3, title: "Character Demo", url: artist.audioDemo },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{artist.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback>{artist.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="mb-2 text-3xl font-bold">{artist.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              {artist.languages.join(", ")}
            </div>
          </div>
        </div>

        <ScrollArea className="h-[500px] rounded-md border">
          <div className="space-y-4 p-4">
            {demoTracks.map((track) => (
              <Card key={track.id}>
                <CardContent className="p-4">
                  <div className="mb-2 font-semibold">{track.title}</div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary p-4">
                    <Mic className="h-5 w-5 text-primary" />
                    <audio controls className="w-full">
                      <source src={track.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ArtistDetail;
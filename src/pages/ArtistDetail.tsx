import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Mic, Mic2, ArrowLeft, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@supabase/auth-helpers-react";

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSessionContext();

  // Query to check if user is admin
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      console.log('Fetching artist details for ID:', id);
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

      if (artistError) {
        console.error('Error fetching artist:', artistError);
        throw artistError;
      }

      const { data: demos, error: demosError } = await supabase
        .from('demos')
        .select('*')
        .eq('artist_id', id)
        .order('is_main', { ascending: false });

      if (demosError) {
        console.error('Error fetching demos:', demosError);
        throw demosError;
      }

      console.log('Artist data:', { ...artistData, demos });
      
      return {
        ...artistData,
        demos
      };
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!artist) {
    return <div className="flex items-center justify-center min-h-screen">Artist not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white relative z-10">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Go back</span>
            </Button>
            
            <h1 className="text-lg font-semibold">Voice Artist Profile</h1>
          </div>

          <div className="flex-1 flex justify-center">
            <img 
              src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png"
              alt="Authentic Voices Logo"
              className="h-24 w-auto"
            />
          </div>

          <div className="w-[68px] flex justify-end">
            {profile?.is_admin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/admin/edit/${artist.id}`)}
                className="ml-2"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Artist</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="p-8 flex-1">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-6">
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

          <ScrollArea className="h-[500px] rounded-md border">
            <div className="space-y-4 p-4">
              {artist.demos?.map((demo) => (
                <Card key={demo.id}>
                  <CardContent className="p-4">
                    <div className="mb-2 font-semibold flex items-center gap-2">
                      {demo.name}
                      {demo.is_main && (
                        <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                          Main Demo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-secondary p-4">
                      <Mic className="h-5 w-5 text-primary" />
                      <audio controls className="w-full">
                        <source src={demo.url} type="audio/mpeg" />
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
      <Footer />
    </div>
  );
};

export default ArtistDetail;
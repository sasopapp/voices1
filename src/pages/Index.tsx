import { useState } from "react";
import { ArtistCard } from "../components/ArtistCard";
import { LanguageSelect } from "../components/LanguageSelect";
import { VoiceoverArtist } from "../types/voiceover";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { LayoutDashboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all");
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch artists using React Query
  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      console.log('Fetching artists...');
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching artists:', error);
        toast.error('Failed to load artists');
        throw error;
      }

      return data.map((artist): VoiceoverArtist => ({
        id: artist.id,
        name: artist.name,
        languages: Array.isArray(artist.languages) ? artist.languages : [],
        audioDemo: artist.audio_demo || '',
        avatar: artist.avatar || '',
        created_by: artist.created_by,
        is_approved: artist.is_approved,
        created_at: artist.created_at
      }));
    },
  });

  // Check if user is admin
  useQuery({
    queryKey: ['isAdmin', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      setIsAdmin(profile?.is_admin || false);
      return profile?.is_admin || false;
    },
    enabled: !!session?.user?.id,
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error during logout');
    }
  };

  const filteredArtists = artists.filter((artist) => {
    if (selectedLanguage === "all") return true;
    return artist.languages.includes(selectedLanguage);
  });

  if (artistsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="w-32">
              {/* Empty div to maintain layout */}
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png" 
                alt="Authentic Voices Logo" 
                className="h-24"
                onClick={() => navigate('/')}
              />
            </div>

            <nav className="flex items-center gap-4">
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              )}
              {session ? (
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#1a365d]">Find Your Voice</h2>
            <p className="mb-8 text-lg text-gray-600">
              Discover professional voiceover artists in multiple languages
            </p>
            <div className="flex justify-center">
              <LanguageSelect value={selectedLanguage} onChange={setSelectedLanguage} />
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
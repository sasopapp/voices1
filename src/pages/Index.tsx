import { useState, useEffect } from "react";
import { ArtistCard } from "../components/ArtistCard";
import { LanguageSelect } from "../components/LanguageSelect";
import { Language, VoiceoverArtist } from "../types/voiceover";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { LayoutDashboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Helper function to validate languages
const validateLanguages = (languages: string[]): Language[] => {
  const validLanguages: Language[] = languages.filter((lang): lang is Language => {
    return ['English', 'Spanish', 'French', 'German', 'Italian'].includes(lang);
  });
  return validLanguages;
};

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "all">("all");
  const navigate = useNavigate();
  const { session, isLoading: sessionLoading } = useSessionContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

      console.log('Artists data:', data);
      return data.map((artist): VoiceoverArtist => ({
        id: artist.id,
        name: artist.name,
        languages: validateLanguages(artist.languages),
        audioDemo: artist.audio_demo,
        avatar: artist.avatar,
      }));
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!session?.user) {
          console.log('No active session');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log('Current user:', session.user);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Error loading user profile');
          setIsAdmin(false);
        } else {
          console.log('User profile:', profile);
          setIsAdmin(profile?.is_admin || false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast.error('Error checking session');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!sessionLoading) {
      checkSession();
    }
  }, [session, sessionLoading]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        toast.error('Failed to log out');
        return;
      }
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out');
    }
  };

  const filteredArtists = artists.filter((artist) =>
    selectedLanguage === "all"
      ? true
      : artist.languages.includes(selectedLanguage)
  );

  if (sessionLoading || isLoading || artistsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-semibold">Voiceover Artists</h1>
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
            <h2 className="mb-4 text-4xl font-bold text-primary">Find Your Voice</h2>
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
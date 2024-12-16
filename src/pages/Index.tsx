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
  const validLanguages = ['English', 'Spanish', 'French', 'German', 'Italian'];
  return languages.filter((lang): lang is Language => 
    validLanguages.includes(lang)
  );
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
      
      // Map and validate the data
      return data.map((artist): VoiceoverArtist => ({
        id: artist.id,
        name: artist.name,
        languages: validateLanguages(artist.languages || []),
        audioDemo: artist.audio_demo || '',
        avatar: artist.avatar || '',
        created_by: artist.created_by,
        is_approved: artist.is_approved,
        created_at: artist.created_at
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
        
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id);
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Error loading user profile');
          setIsAdmin(false);
        } else if (!profiles || profiles.length === 0) {
          console.log('No profile found for user');
          setIsAdmin(false);
        } else {
          const profile = profiles[0];
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
        console.error('Error during logout:', error);
        toast.error('Error during logout');
      } else {
        localStorage.clear();
        toast.success('Logged out successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Exception during logout:', error);
      toast.error('Error during logout');
      navigate('/login');
    }
  };

  // Updated filtering logic
  const filteredArtists = artists.filter((artist) => {
    if (selectedLanguage === "all") return true;
    return artist.languages.includes(selectedLanguage);
  });

  console.log('Selected language:', selectedLanguage);
  console.log('Filtered artists:', filteredArtists);

  if (sessionLoading || isLoading || artistsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-bold">Voiceover Artists</h1>
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
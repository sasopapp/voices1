import { useState } from "react";
import { LanguageSelect } from "../components/LanguageSelect";
import { Language } from "../types/voiceover";
import { voiceoverArtists } from "../data/voiceover-artists";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "all">("all");
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const filteredArtists = voiceoverArtists.filter((artist) =>
    selectedLanguage === "all"
      ? true
      : artist.languages.includes(selectedLanguage as Language)
  );

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-semibold">Voiceover Artists</h1>
            <nav>
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
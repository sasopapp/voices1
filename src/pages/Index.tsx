import { useState } from "react";
import { ArtistCard } from "../components/ArtistCard";
import { LanguageSelect } from "../components/LanguageSelect";
import { Language } from "../types/voiceover";
import { voiceoverArtists } from "../data/voiceover-artists";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "all">("all");
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">Voiceover Artists</h1>
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

        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="w-full max-w-xs"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
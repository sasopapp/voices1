import { useState } from "react";
import { ArtistCard } from "../components/ArtistCard";
import { LanguageSelect } from "../components/LanguageSelect";
import { Language } from "../types/voiceover";
import { voiceoverArtists } from "../data/voiceover-artists";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "all">("all");

  const filteredArtists = voiceoverArtists.filter((artist) =>
    selectedLanguage === "all"
      ? true
      : artist.languages.includes(selectedLanguage as Language)
  );

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
      </div>
    </div>
  );
};

export default Index;
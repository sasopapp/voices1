export type Language = "English" | "Spanish" | "French" | "German" | "Italian";

export interface VoiceoverArtist {
  id: string;
  name: string;
  languages: Language[];
  audioDemo: string;
  avatar: string;
}
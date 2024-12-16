export type Language = 
  | "English" 
  | "Spanish" 
  | "French" 
  | "German" 
  | "Italian"
  | "Croatian"
  | "Serbian"
  | "Slovak"
  | "Slovene";

export interface VoiceoverArtist {
  id: string;
  name: string;
  languages: Language[];
  audioDemo: string | null;
  avatar: string | null;
  created_by?: string;
  is_approved?: boolean;
  created_at?: string;
}
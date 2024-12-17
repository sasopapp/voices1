export interface VoiceoverArtist {
  id: string;
  name: string;
  languages: string[];
  audioDemo: string | null;
  avatar: string | null;
  created_by?: string;
  is_approved?: boolean;
  created_at?: string;
  voice_gender: string | null;
}
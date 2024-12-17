export interface Demo {
  id: string;
  artist_id: string;
  name: string;
  url: string;
  is_main: boolean;
  created_at?: string;
}

export interface VoiceoverArtist {
  id: string;
  name: string;
  languages: string[];
  demos?: Demo[];
  avatar: string | null;
  created_by?: string;
  is_approved?: boolean;
  created_at?: string;
  voice_gender: string | null;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
}
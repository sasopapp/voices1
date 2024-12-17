import { VoiceoverArtist } from "../types/voiceover";

export const voiceoverArtists: VoiceoverArtist[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    languages: ["English", "French"],
    demos: [{
      id: "1",
      artist_id: "1",
      name: "Main Demo",
      url: "https://example.com/demo1.mp3",
      is_main: true,
      created_at: new Date().toISOString()
    }],
    avatar: "/placeholder.svg",
    voice_gender: "female",
    email: "sarah.johnson@example.com",
    firstname: "Sarah",
    lastname: "Johnson",
    username: "sarahjohnson",
    bio: "Professional voice artist specializing in commercials and narration."
  },
  {
    id: "2",
    name: "Miguel Rodriguez",
    languages: ["Spanish", "English"],
    demos: [{
      id: "2",
      artist_id: "2",
      name: "Main Demo",
      url: "https://example.com/demo2.mp3",
      is_main: true,
      created_at: new Date().toISOString()
    }],
    avatar: "/placeholder.svg",
    voice_gender: "male",
    email: "miguel.rodriguez@example.com",
    firstname: "Miguel",
    lastname: "Rodriguez",
    username: "miguelrodriguez",
    bio: "Bilingual voice talent with expertise in dubbing and animation."
  },
  {
    id: "3",
    name: "Anna Schmidt",
    languages: ["German", "English"],
    demos: [{
      id: "3",
      artist_id: "3",
      name: "Main Demo",
      url: "https://example.com/demo3.mp3",
      is_main: true,
      created_at: new Date().toISOString()
    }],
    avatar: "/placeholder.svg",
    voice_gender: "female",
    email: "anna.schmidt@example.com",
    firstname: "Anna",
    lastname: "Schmidt",
    username: "annaschmidt",
    bio: "Experienced voice actor for audiobooks and e-learning content."
  },
  {
    id: "4",
    name: "Marco Rossi",
    languages: ["Italian", "English"],
    demos: [{
      id: "4",
      artist_id: "4",
      name: "Main Demo",
      url: "https://example.com/demo4.mp3",
      is_main: true,
      created_at: new Date().toISOString()
    }],
    avatar: "/placeholder.svg",
    voice_gender: "male",
    email: "marco.rossi@example.com",
    firstname: "Marco",
    lastname: "Rossi",
    username: "marcorossi",
    bio: "Italian voice talent specializing in commercial and corporate content."
  },
];

export const languages = ["English", "Spanish", "French", "German", "Italian"] as const;
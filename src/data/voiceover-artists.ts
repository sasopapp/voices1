import { VoiceoverArtist } from "../types/voiceover";

export const voiceoverArtists: VoiceoverArtist[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    languages: ["English", "French"],
    audioDemo: "https://example.com/demo1.mp3",
    avatar: "/placeholder.svg",
    voice_gender: "female"
  },
  {
    id: "2",
    name: "Miguel Rodriguez",
    languages: ["Spanish", "English"],
    audioDemo: "https://example.com/demo2.mp3",
    avatar: "/placeholder.svg",
    voice_gender: "male"
  },
  {
    id: "3",
    name: "Anna Schmidt",
    languages: ["German", "English"],
    audioDemo: "https://example.com/demo3.mp3",
    avatar: "/placeholder.svg",
    voice_gender: "female"
  },
  {
    id: "4",
    name: "Marco Rossi",
    languages: ["Italian", "English"],
    audioDemo: "https://example.com/demo4.mp3",
    avatar: "/placeholder.svg",
    voice_gender: "male"
  },
];

export const languages = ["English", "Spanish", "French", "German", "Italian"] as const;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Language } from "../types/voiceover";
import { languages } from "../data/voiceover-artists";

interface LanguageSelectProps {
  value: Language | "all";
  onChange: (value: Language | "all") => void;
}

export const LanguageSelect = ({ value, onChange }: LanguageSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Languages</SelectItem>
        {languages.map((language) => (
          <SelectItem key={language} value={language}>
            {language}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
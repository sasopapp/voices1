import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LanguageSelectProps {
  value: string | "all";
  onChange: (value: string | "all") => void;
}

export const LanguageSelect = ({ value, onChange }: LanguageSelectProps) => {
  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages from Supabase...');
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .order('name');

      if (error) {
        console.error('Error fetching languages:', error);
        throw error;
      }

      console.log('Languages loaded:', data);
      return data.map(lang => lang.name);
    },
  });

  if (isLoading) {
    return <div>Loading languages...</div>;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] bg-white">
        <SelectValue placeholder="All Languages" />
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
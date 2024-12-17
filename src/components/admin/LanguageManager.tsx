import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LanguageForm } from "./languages/LanguageForm";
import { LanguageList } from "./languages/LanguageList";

interface Language {
  id: string;
  name: string;
}

export const LanguageManager = () => {
  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages...');
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching languages:', error);
        throw error;
      }

      console.log('Languages loaded:', data);
      return data as Language[];
    },
    staleTime: 30000, // Data stays fresh for 30 seconds
    gcTime: 3600000,  // Keep unused data in cache for 1 hour
  });

  if (isLoading) {
    console.log('Loading languages...');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Manage Languages</h2>
        <LanguageForm />
        <LanguageList languages={languages} isLoading={isLoading} />
      </div>
    </div>
  );
};
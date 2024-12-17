import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Language {
  id: string;
  name: string;
  created_at: string;
  created_by: string | null;
}

interface LanguageListProps {
  languages: Language[];
  isLoading: boolean;
}

export const LanguageList = ({ languages, isLoading }: LanguageListProps) => {
  const queryClient = useQueryClient();

  console.log('Languages in LanguageList:', languages);

  const deleteLanguageMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting language:', id);
      const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting language:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Language deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast.success('Language deleted successfully');
    },
    onError: (error) => {
      console.error('Error in deletion:', error);
      toast.error('Failed to delete language');
    },
  });

  if (isLoading) {
    return <div className="text-gray-600">Loading languages...</div>;
  }

  if (!languages || languages.length === 0) {
    return <div className="text-gray-600">No languages found.</div>;
  }

  return (
    <div className="space-y-2">
      {languages.map((language) => (
        <div 
          key={language.id} 
          className="flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <span className="text-gray-900">{language.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteLanguageMutation.mutate(language.id)}
            disabled={deleteLanguageMutation.isPending}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
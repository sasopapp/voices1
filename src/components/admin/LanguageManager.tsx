import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Language {
  id: string;
  name: string;
}

export const LanguageManager = () => {
  const [newLanguage, setNewLanguage] = useState("");
  const queryClient = useQueryClient();

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
        toast.error('Failed to load languages');
        throw error;
      }

      console.log('Languages loaded:', data);
      return data as Language[];
    },
  });

  const addLanguageMutation = useMutation({
    mutationFn: async (name: string) => {
      console.log('Adding new language:', name);
      const { error } = await supabase
        .from('languages')
        .insert([{ name }]);

      if (error) {
        console.error('Error adding language:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Language added successfully');
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      setNewLanguage("");
      toast.success('Language added successfully');
    },
    onError: (error) => {
      console.error('Error in mutation:', error);
      toast.error('Failed to add language');
    },
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLanguage.trim()) return;
    
    addLanguageMutation.mutate(newLanguage.trim());
  };

  if (isLoading) {
    return <div>Loading languages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Manage Languages</h2>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="Add new language..."
            className="max-w-xs"
          />
          <Button 
            type="submit" 
            disabled={addLanguageMutation.isPending || !newLanguage.trim()}
          >
            Add Language
          </Button>
        </form>

        <div className="grid gap-2">
          {languages.map((language) => (
            <div 
              key={language.id} 
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
            >
              <span>{language.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteLanguageMutation.mutate(language.id)}
                disabled={deleteLanguageMutation.isPending}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
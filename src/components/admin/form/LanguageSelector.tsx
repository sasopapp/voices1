import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface LanguageSelectorProps {
  languages: string[]
  onLanguageAdd: (language: string) => void
  onLanguageRemove: (language: string) => void
}

export const LanguageSelector = ({ 
  languages, 
  onLanguageAdd, 
  onLanguageRemove 
}: LanguageSelectorProps) => {
  const { data: availableLanguages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching available languages...')
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      console.log('Languages loaded:', data)
      return data.map(lang => lang.name)
    },
  })

  return (
    <div>
      <Select onValueChange={onLanguageAdd}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-2 flex flex-wrap gap-2">
        {languages.map((lang) => (
          <div
            key={lang}
            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
          >
            {lang}
            <button
              type="button"
              onClick={() => onLanguageRemove(lang)}
              className="text-secondary-foreground/50 hover:text-secondary-foreground"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
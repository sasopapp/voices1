import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

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
      // Map the language objects to just their names
      return data.map(lang => lang.name)
    },
  })

  const unusedLanguages = availableLanguages.filter(lang => !languages.includes(lang))

  return (
    <div className="space-y-4">
      <Select
        onValueChange={onLanguageAdd}
        disabled={unusedLanguages.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder="Add a language" />
        </SelectTrigger>
        <SelectContent>
          {unusedLanguages.map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <Badge key={language} variant="secondary" className="flex items-center gap-1">
            {language}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onLanguageRemove(language)}
            />
          </Badge>
        ))}
      </div>
    </div>
  )
}
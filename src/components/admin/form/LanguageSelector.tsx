import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

interface LanguageSelectorProps {
  languages: string[]
  onLanguageAdd: (language: string) => void
  onLanguageRemove: (language: string) => void
}

interface Language {
  id: string
  name: string
}

export const LanguageSelector = ({
  languages,
  onLanguageAdd,
  onLanguageRemove,
}: LanguageSelectorProps) => {
  const { data: availableLanguages = [], isLoading } = useQuery({
    queryKey: ['available-languages'],
    queryFn: async () => {
      console.log('Fetching available languages...')
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      console.log('Languages loaded:', data)
      return data as Language[]
    }
  })

  if (isLoading) {
    return <div>Loading languages...</div>
  }

  const availableLanguagesForSelect = availableLanguages.filter(
    lang => !languages.includes(lang.name)
  )

  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          if (!languages.includes(value)) {
            onLanguageAdd(value)
          }
        }}
      >
        <SelectTrigger className="w-full bg-white border border-input">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent 
          className="bg-white border border-input shadow-md max-h-[300px] overflow-y-auto"
          position="popper"
          sideOffset={4}
        >
          {availableLanguagesForSelect.map((lang) => (
            <SelectItem 
              key={lang.id} 
              value={lang.name}
              className="bg-white hover:bg-gray-100 cursor-pointer py-2 px-3"
            >
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <Badge
            key={language}
            variant="secondary"
            className="flex items-center gap-1 py-1 px-2"
          >
            {language}
            <button
              onClick={() => onLanguageRemove(language)}
              className="ml-1 hover:bg-secondary/80 rounded-full p-0.5"
              type="button"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {language}</span>
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
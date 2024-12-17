import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
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

export const LanguageSelector = ({
  languages,
  onLanguageAdd,
  onLanguageRemove,
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
      return data
    },
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Languages</Label>
        <Select
          onValueChange={(value) => {
            if (!languages.includes(value)) {
              onLanguageAdd(value)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.name} value={lang.name}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <Badge
            key={language}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {language}
            <button
              onClick={() => onLanguageRemove(language)}
              className="ml-1 rounded-full hover:bg-secondary"
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
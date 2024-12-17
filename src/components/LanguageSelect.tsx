import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Language {
  id: string
  name: string
  created_at: string
  created_by: string | null
}

interface LanguageSelectProps {
  value: string | "all"
  onChange: (value: string | "all") => void
}

export const LanguageSelect = ({ value, onChange }: LanguageSelectProps) => {
  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages for select...')
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
    },
    initialData: [], 
    staleTime: 0,
    refetchOnMount: 'always'
  })

  if (isLoading) {
    return <div>Loading languages...</div>
  }

  // Find the selected language object
  const selectedLanguage = languages.find(lang => lang.name === value)
  const displayValue = value === "all" ? "All Languages" : selectedLanguage?.name || value

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue>
          {displayValue}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="all" className="bg-white hover:bg-gray-100">
          All Languages
        </SelectItem>
        {languages.map((language: Language) => (
          <SelectItem 
            key={language.id} 
            value={language.name}
            className="bg-white hover:bg-gray-100"
          >
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
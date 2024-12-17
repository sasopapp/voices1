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
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnMount: true,     // Refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
    initialData: [],          // Provide initial empty array
  })

  if (isLoading) {
    return <div>Loading languages...</div>
  }

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px] bg-white border border-input">
        <SelectValue placeholder="Select language">
          {value === "all" ? "All Languages" : value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border border-input shadow-md">
        <SelectItem 
          key="all" 
          value="all" 
          className="bg-white hover:bg-gray-100 cursor-pointer"
        >
          All Languages
        </SelectItem>
        {languages.map((language) => (
          <SelectItem 
            key={language.id} 
            value={language.name}
            className="bg-white hover:bg-gray-100 cursor-pointer"
          >
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
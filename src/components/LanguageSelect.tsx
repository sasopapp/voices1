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
      console.log('Fetching languages for dropdown...')
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
    staleTime: 0, // Always consider data stale
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes (renamed from cacheTime)
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnReconnect: true, // Refetch when reconnecting
  })

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[180px] bg-gray-100">
          <SelectValue placeholder="Loading languages..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Select language">
          {value === "all" ? "All Languages" : value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="all">All Languages</SelectItem>
        {languages.map((language) => (
          <SelectItem 
            key={language.id} 
            value={language.name}
          >
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
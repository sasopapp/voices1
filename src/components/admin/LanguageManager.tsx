import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { LanguageForm } from "./languages/LanguageForm"
import { LanguageList } from "./languages/LanguageList"
import { Loader2 } from "lucide-react"

interface Language {
  id: string
  name: string
  created_at: string
  created_by: string | null
}

export const LanguageManager = () => {
  const { data: languages = [], isLoading, error } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages in LanguageManager...')
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      console.log('Languages loaded in LanguageManager:', data)
      return data as Language[]
    },
  })

  if (error) {
    console.error('Error in LanguageManager:', error)
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Manage Languages</h2>
          <div className="text-red-500 p-4 rounded-lg bg-red-50">
            Error loading languages. Please try again later.
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Manage Languages</h2>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Manage Languages</h2>
        <LanguageForm />
        <LanguageList languages={languages} isLoading={isLoading} />
      </div>
    </div>
  )
}
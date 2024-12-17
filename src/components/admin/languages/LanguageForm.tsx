import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export const LanguageForm = () => {
  const [newLanguage, setNewLanguage] = useState("")
  const queryClient = useQueryClient()

  const addLanguageMutation = useMutation({
    mutationFn: async (name: string) => {
      console.log('Adding new language:', name)
      const { error } = await supabase
        .from('languages')
        .insert([{ name }])

      if (error) {
        console.error('Error adding language:', error)
        throw error
      }
    },
    onSuccess: () => {
      console.log('Language added successfully')
      queryClient.invalidateQueries({ queryKey: ['languages'] })
      setNewLanguage("")
      toast.success('Language added successfully')
    },
    onError: (error) => {
      console.error('Error in mutation:', error)
      toast.error('Failed to add language')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLanguage.trim()) return
    
    addLanguageMutation.mutate(newLanguage.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={newLanguage}
        onChange={(e) => setNewLanguage(e.target.value)}
        placeholder="Add new language..."
        className="flex-1"
      />
      <Button 
        type="submit" 
        variant="secondary"
        disabled={addLanguageMutation.isPending || !newLanguage.trim()}
      >
        Add Language
      </Button>
    </form>
  )
}
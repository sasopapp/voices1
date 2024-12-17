import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { LanguageItem } from "./LanguageItem"
import { LanguageEditForm } from "./LanguageEditForm"

interface Language {
  id: string
  name: string
  created_at: string
  created_by: string | null
}

interface LanguageListProps {
  languages: Language[]
  isLoading: boolean
}

export const LanguageList = ({ languages, isLoading }: LanguageListProps) => {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState("")

  console.log('Languages in LanguageList:', languages)

  const deleteLanguageMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting language:', id)
      const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting language:', error)
        throw error
      }
    },
    onSuccess: () => {
      console.log('Language deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['languages'] })
      toast.success('Language deleted successfully')
    },
    onError: (error) => {
      console.error('Error in deletion:', error)
      toast.error('Failed to delete language')
    },
  })

  const updateLanguageMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      console.log('Updating language:', { id, name })
      const { error } = await supabase
        .from('languages')
        .update({ name })
        .eq('id', id)

      if (error) {
        console.error('Error updating language:', error)
        throw error
      }
    },
    onSuccess: () => {
      console.log('Language updated successfully')
      setEditingId(null)
      queryClient.invalidateQueries({ queryKey: ['languages'] })
      toast.success('Language updated successfully')
    },
    onError: (error) => {
      console.error('Error in update:', error)
      toast.error('Failed to update language')
    },
  })

  const handleEdit = (language: Language) => {
    setEditingId(language.id)
    setEditedName(language.name)
  }

  const handleUpdate = (id: string) => {
    if (!editedName.trim()) {
      toast.error('Language name cannot be empty')
      return
    }
    updateLanguageMutation.mutate({ id, name: editedName.trim() })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedName("")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading languages...</span>
      </div>
    )
  }

  if (!languages || languages.length === 0) {
    return <div className="text-gray-600 p-4">No languages found.</div>
  }

  return (
    <div className="space-y-2">
      {languages.map((language) => (
        <div key={language.id}>
          {editingId === language.id ? (
            <LanguageEditForm
              editedName={editedName}
              onNameChange={setEditedName}
              onUpdate={() => handleUpdate(language.id)}
              onCancel={handleCancel}
              updateLanguageMutation={updateLanguageMutation}
            />
          ) : (
            <LanguageItem
              language={language}
              onEdit={handleEdit}
              deleteLanguageMutation={deleteLanguageMutation}
            />
          )}
        </div>
      ))}
    </div>
  )
}
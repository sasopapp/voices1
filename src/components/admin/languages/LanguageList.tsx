import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Pencil, X, Check } from "lucide-react"
import { toast } from "sonner"

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
    if (!editedName.trim()) return
    updateLanguageMutation.mutate({ id, name: editedName.trim() })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedName("")
  }

  if (isLoading) {
    return <div className="text-gray-600">Loading languages...</div>
  }

  if (!languages || languages.length === 0) {
    return <div className="text-gray-600">No languages found.</div>
  }

  return (
    <div className="space-y-2">
      {languages.map((language) => (
        <div 
          key={language.id} 
          className="flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          {editingId === language.id ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1"
                placeholder="Enter language name"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUpdate(language.id)}
                disabled={updateLanguageMutation.isPending}
                className="text-green-500 hover:text-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-600 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span className="text-gray-900">{language.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(language)}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLanguageMutation.mutate(language.id)}
                  disabled={deleteLanguageMutation.isPending}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
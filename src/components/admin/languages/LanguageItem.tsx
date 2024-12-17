import { Button } from "@/components/ui/button"
import { Trash2, Pencil, Loader2 } from "lucide-react"
import { UseMutationResult } from "@tanstack/react-query"

interface Language {
  id: string
  name: string
  created_at: string
  created_by: string | null
}

interface LanguageItemProps {
  language: Language
  onEdit: (language: Language) => void
  deleteLanguageMutation: UseMutationResult<void, Error, string>
}

export const LanguageItem = ({ 
  language, 
  onEdit, 
  deleteLanguageMutation 
}: LanguageItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <span className="text-gray-900">{language.name}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(language)}
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
          {deleteLanguageMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
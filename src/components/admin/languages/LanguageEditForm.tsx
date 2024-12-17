import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, Loader2 } from "lucide-react"
import { UseMutationResult } from "@tanstack/react-query"

interface LanguageEditFormProps {
  editedName: string
  onNameChange: (name: string) => void
  onUpdate: () => void
  onCancel: () => void
  updateLanguageMutation: UseMutationResult<void, Error, { id: string; name: string }>
}

export const LanguageEditForm = ({
  editedName,
  onNameChange,
  onUpdate,
  onCancel,
  updateLanguageMutation
}: LanguageEditFormProps) => {
  return (
    <div className="flex items-center gap-2 flex-1">
      <Input
        value={editedName}
        onChange={(e) => onNameChange(e.target.value)}
        className="flex-1"
        placeholder="Enter language name"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onUpdate}
        disabled={updateLanguageMutation.isPending}
        className="text-green-500 hover:text-green-600 hover:bg-green-50"
      >
        {updateLanguageMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCancel}
        className="text-gray-500 hover:text-gray-600 hover:bg-gray-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
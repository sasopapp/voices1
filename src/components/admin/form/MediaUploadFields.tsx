import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MediaUploadFieldsProps {
  onAvatarChange: (file: File | null) => void
}

export const MediaUploadFields = ({ 
  onAvatarChange 
}: MediaUploadFieldsProps) => {
  return (
    <div>
      <Label htmlFor="avatar">New Avatar (optional)</Label>
      <Input
        id="avatar"
        type="file"
        accept="image/*"
        onChange={(e) => onAvatarChange(e.target.files?.[0] || null)}
      />
    </div>
  )
}
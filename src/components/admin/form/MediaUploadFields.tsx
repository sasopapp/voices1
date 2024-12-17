import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MediaUploadFieldsProps {
  onAudioChange: (file: File | null) => void
  onAvatarChange: (file: File | null) => void
}

export const MediaUploadFields = ({ 
  onAudioChange, 
  onAvatarChange 
}: MediaUploadFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="audio">New Audio Demo (optional)</Label>
        <Input
          id="audio"
          type="file"
          accept="audio/*"
          onChange={(e) => onAudioChange(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <Label htmlFor="avatar">New Avatar (optional)</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => onAvatarChange(e.target.files?.[0] || null)}
        />
      </div>
    </>
  )
}
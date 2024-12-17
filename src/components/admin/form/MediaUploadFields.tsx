import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface MediaUploadFieldsProps {
  onAvatarChange: (file: File) => void
}

export const MediaUploadFields = ({
  onAvatarChange,
}: MediaUploadFieldsProps) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAvatarChange(file)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Profile Picture</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  )
}
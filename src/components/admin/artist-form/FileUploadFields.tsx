import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploadFieldsProps {
  setAudioDemo: (file: File | null) => void
  setAvatar: (file: File | null) => void
}

export const FileUploadFields = ({
  setAudioDemo,
  setAvatar,
}: FileUploadFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="audio">New Audio Demo (optional)</Label>
        <Input
          id="audio"
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioDemo(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <Label htmlFor="avatar">New Avatar (optional)</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />
      </div>
    </>
  )
}
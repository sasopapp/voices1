import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UsernameFieldProps {
  username: string
  onUsernameChange: (value: string) => void
}

export const UsernameField = ({ username, onUsernameChange }: UsernameFieldProps) => {
  return (
    <div>
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        required
      />
    </div>
  )
}
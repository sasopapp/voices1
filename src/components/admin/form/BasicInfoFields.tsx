import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BasicInfoFieldsProps {
  firstname: string
  lastname: string
  email: string
  onFirstnameChange: (value: string) => void
  onLastnameChange: (value: string) => void
  onEmailChange: (value: string) => void
}

export const BasicInfoFields = ({
  firstname,
  lastname,
  email,
  onFirstnameChange,
  onLastnameChange,
  onEmailChange,
}: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            placeholder="First name"
            value={firstname}
            onChange={(e) => onFirstnameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => onLastnameChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
    </div>
  )
}
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BasicInfoFieldsProps {
  firstname: string
  lastname: string
  email: string
  username: string
  onFirstnameChange: (value: string) => void
  onLastnameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onUsernameChange: (value: string) => void
}

export const BasicInfoFields = ({
  firstname,
  lastname,
  email,
  username,
  onFirstnameChange,
  onLastnameChange,
  onEmailChange,
  onUsernameChange,
}: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstname">First Name <span className="text-red-500">*</span></Label>
          <Input
            id="firstname"
            placeholder="First name"
            value={firstname}
            onChange={(e) => onFirstnameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastname">Last Name <span className="text-red-500">*</span></Label>
          <Input
            id="lastname"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => onLastnameChange(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
          <Input
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  )
}
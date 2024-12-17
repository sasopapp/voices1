import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface BasicInfoFieldsProps {
  firstname: string
  lastname: string
  email: string
  voiceGender: string
  onFirstnameChange: (value: string) => void
  onLastnameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onVoiceGenderChange: (value: string) => void
}

export const BasicInfoFields = ({
  firstname,
  lastname,
  email,
  voiceGender,
  onFirstnameChange,
  onLastnameChange,
  onEmailChange,
  onVoiceGenderChange,
}: BasicInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="firstname">First Name</Label>
        <Input
          id="firstname"
          value={firstname}
          onChange={(e) => onFirstnameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="lastname">Last Name</Label>
        <Input
          id="lastname"
          value={lastname}
          onChange={(e) => onLastnameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Voice Gender</Label>
        <RadioGroup
          value={voiceGender}
          onValueChange={onVoiceGenderChange}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
      </div>
    </>
  )
}
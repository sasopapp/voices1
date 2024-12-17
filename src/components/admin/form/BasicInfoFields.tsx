import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BasicInfoFieldsProps {
  firstname: string
  lastname: string
  email: string
  voiceGender: string
  bio: string
  onFirstnameChange: (value: string) => void
  onLastnameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onVoiceGenderChange: (value: string) => void
  onBioChange: (value: string) => void
}

export const BasicInfoFields = ({
  firstname,
  lastname,
  email,
  voiceGender,
  bio,
  onFirstnameChange,
  onLastnameChange,
  onEmailChange,
  onVoiceGenderChange,
  onBioChange,
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

      <div className="space-y-2">
        <Label htmlFor="voice-gender">Voice Gender</Label>
        <Select value={voiceGender} onValueChange={onVoiceGenderChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select voice gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (250 characters max)</Label>
        <Textarea
          id="bio"
          placeholder="Enter your bio"
          value={bio}
          onChange={(e) => {
            if (e.target.value.length <= 250) {
              onBioChange(e.target.value)
            }
          }}
          maxLength={250}
          className="resize-none"
        />
        <div className="text-sm text-muted-foreground text-right">
          {bio.length}/250
        </div>
      </div>
    </div>
  )
}
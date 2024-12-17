import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface VoiceGenderFieldProps {
  voiceGender: string
  setVoiceGender: (value: string) => void
}

export const VoiceGenderField = ({
  voiceGender,
  setVoiceGender,
}: VoiceGenderFieldProps) => {
  return (
    <div>
      <Label>Voice Gender</Label>
      <RadioGroup
        value={voiceGender}
        onValueChange={setVoiceGender}
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
  )
}
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BasicInfoFieldsProps {
  firstname: string
  lastname: string
  email: string
  setFirstname: (value: string) => void
  setLastname: (value: string) => void
  setEmail: (value: string) => void
}

export const BasicInfoFields = ({
  firstname,
  lastname,
  email,
  setFirstname,
  setLastname,
  setEmail,
}: BasicInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="firstname">First Name</Label>
        <Input
          id="firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="lastname">Last Name</Label>
        <Input
          id="lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
    </>
  )
}
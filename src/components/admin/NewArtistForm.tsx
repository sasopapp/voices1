import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { LanguageSelector } from "./form/LanguageSelector"
import { MediaUploadFields } from "./form/MediaUploadFields"
import { DemoManager } from "./form/DemoManager"

export const NewArtistForm = () => {
  const navigate = useNavigate()
  const { session } = useSessionContext()
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [avatar, setAvatar] = useState<File | null>(null)
  const [voiceGender, setVoiceGender] = useState<string>("")
  const [bio, setBio] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstname || !lastname || !email || !username || languages.length === 0 || !voiceGender || !bio) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!session?.user?.id) {
      toast.error('You must be logged in to create an artist')
      return
    }

    try {
      setIsSubmitting(true)
      console.log('Starting artist creation process...')

      let avatarUrl = null

      if (avatar) {
        console.log('Uploading avatar...')
        const avatarFileName = `${Date.now()}-${avatar.name}`
        const { error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatar)

        if (avatarError) {
          console.error('Avatar upload error:', avatarError)
          throw new Error('Failed to upload avatar')
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName)
        
        avatarUrl = publicUrl
        console.log('Avatar uploaded successfully:', avatarUrl)
      }

      console.log('Creating artist record...')
      const { data: artistData, error: insertError } = await supabase
        .from('artists')
        .insert({
          firstname,
          lastname,
          name: `${firstname} ${lastname}`,
          email,
          username,
          languages,
          avatar: avatarUrl,
          created_by: session.user.id,
          voice_gender: voiceGender,
          bio,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating artist:', insertError)
        throw insertError
      }

      console.log('Artist created successfully')
      toast.success('Artist created successfully')
      navigate('/admin')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Failed to create artist: ' + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <BasicInfoFields
        firstname={firstname}
        lastname={lastname}
        email={email}
        username={username}
        onFirstnameChange={setFirstname}
        onLastnameChange={setLastname}
        onEmailChange={setEmail}
        onUsernameChange={setUsername}
      />

      <div className="space-y-2">
        <Label>Voice Gender</Label>
        <RadioGroup
          value={voiceGender}
          onValueChange={setVoiceGender}
          className="flex flex-col space-y-1"
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

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (250 characters max)</Label>
        <Textarea
          id="bio"
          placeholder="Enter your bio"
          value={bio}
          onChange={(e) => {
            if (e.target.value.length <= 250) {
              setBio(e.target.value)
            }
          }}
          maxLength={250}
          className="resize-none"
        />
        <div className="text-sm text-muted-foreground text-right">
          {bio.length}/250
        </div>
      </div>

      <div>
        <LanguageSelector
          languages={languages}
          onLanguageAdd={(lang) => setLanguages(prev => [...prev, lang])}
          onLanguageRemove={(lang) => setLanguages(languages.filter(l => l !== lang))}
        />
      </div>

      <DemoManager
        artistId=""
        initialDemos={[]}
      />

      <MediaUploadFields
        onAvatarChange={setAvatar}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Artist...' : 'Create Artist'}
      </Button>
    </form>
  )
}

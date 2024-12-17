import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { LanguageSelector } from "./form/LanguageSelector"
import { MediaUploadFields } from "./form/MediaUploadFields"
import { UsernameField } from "./form/UsernameField"

interface NewArtistFormProps {
  availableLanguages: string[]
}

export const NewArtistForm = ({ availableLanguages }: NewArtistFormProps) => {
  const navigate = useNavigate()
  const { session } = useSessionContext()
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [audioDemo, setAudioDemo] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [voiceGender, setVoiceGender] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstname || !lastname || !email || !username || languages.length === 0 || !voiceGender) {
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
      let audioDemoUrl = null

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

      if (audioDemo) {
        console.log('Uploading audio demo...')
        const audioFileName = `${Date.now()}-${audioDemo.name}`
        const { error: audioError } = await supabase.storage
          .from('demos')
          .upload(audioFileName, audioDemo)

        if (audioError) {
          console.error('Audio demo upload error:', audioError)
          throw new Error('Failed to upload audio demo')
        }

        const { data: { publicUrl } } = supabase.storage
          .from('demos')
          .getPublicUrl(audioFileName)
        
        audioDemoUrl = publicUrl
        console.log('Audio demo uploaded successfully:', audioDemoUrl)
      }

      console.log('Creating artist record...')
      const { error: insertError } = await supabase
        .from('artists')
        .insert({
          firstname,
          lastname,
          name: `${firstname} ${lastname}`,
          email,
          username,
          languages,
          avatar: avatarUrl,
          audio_demo: audioDemoUrl,
          created_by: session.user.id,
          voice_gender: voiceGender,
        })

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
        voiceGender={voiceGender}
        onFirstnameChange={setFirstname}
        onLastnameChange={setLastname}
        onEmailChange={setEmail}
        onVoiceGenderChange={setVoiceGender}
      />

      <UsernameField
        username={username}
        onUsernameChange={setUsername}
      />

      <div>
        <LanguageSelector
          languages={languages}
          onLanguageAdd={(lang) => setLanguages(prev => [...prev, lang])}
          onLanguageRemove={(lang) => setLanguages(languages.filter(l => l !== lang))}
        />
      </div>

      <MediaUploadFields
        onAvatarChange={setAvatar}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Artist...' : 'Create Artist'}
      </Button>
    </form>
  )
}

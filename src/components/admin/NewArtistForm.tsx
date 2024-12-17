import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { LanguageSelector } from "./form/LanguageSelector"
import { MediaUploadFields } from "./form/MediaUploadFields"
import { UsernameField } from "./form/UsernameField"
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
        voiceGender={voiceGender}
        bio={bio}
        onFirstnameChange={setFirstname}
        onLastnameChange={setLastname}
        onEmailChange={setEmail}
        onVoiceGenderChange={setVoiceGender}
        onBioChange={setBio}
      />

      <div>
        <LanguageSelector
          languages={languages}
          onLanguageAdd={(lang) => setLanguages(prev => [...prev, lang])}
          onLanguageRemove={(lang) => setLanguages(languages.filter(l => l !== lang))}
        />
      </div>

      <UsernameField
        username={username}
        onUsernameChange={setUsername}
      />

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
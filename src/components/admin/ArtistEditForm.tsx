import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { BasicInfoFields } from "./artist-form/BasicInfoFields"
import { VoiceGenderField } from "./artist-form/VoiceGenderField"
import { LanguagesField } from "./artist-form/LanguagesField"
import { FileUploadFields } from "./artist-form/FileUploadFields"

interface ArtistEditFormProps {
  artist: {
    id: string
    name: string
    languages: string[]
    voice_gender: string
    email: string
    firstname: string
    lastname: string
  } | null
  availableLanguages: string[]
  onSuccess: () => void
}

export const ArtistEditForm = ({ artist, availableLanguages, onSuccess }: ArtistEditFormProps) => {
  const [firstname, setFirstname] = useState(artist?.firstname || "")
  const [lastname, setLastname] = useState(artist?.lastname || "")
  const [email, setEmail] = useState(artist?.email || "")
  const [languages, setLanguages] = useState<string[]>(artist?.languages || [])
  const [audioDemo, setAudioDemo] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [voiceGender, setVoiceGender] = useState<string>(artist?.voice_gender || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      console.log('Starting artist update process...')

      let updates: any = {
        firstname,
        lastname,
        email,
        name: `${firstname} ${lastname}`,
        languages,
        voice_gender: voiceGender,
      }

      if (avatar) {
        console.log('Uploading new avatar...')
        const avatarFileName = `${Date.now()}-${avatar.name}`
        const { error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatar)

        if (avatarError) {
          console.error('Avatar upload error:', avatarError)
          throw new Error('Failed to upload avatar')
        }

        const { data: { publicUrl: avatarPublicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName)
        
        updates.avatar = avatarPublicUrl
        console.log('New avatar uploaded successfully:', avatarPublicUrl)
      }

      if (audioDemo) {
        console.log('Uploading new audio demo...')
        const audioFileName = `${Date.now()}-${audioDemo.name}`
        const { error: audioError } = await supabase.storage
          .from('demos')
          .upload(audioFileName, audioDemo)

        if (audioError) {
          console.error('Audio demo upload error:', audioError)
          throw new Error('Failed to upload audio demo')
        }

        const { data: { publicUrl: audioPublicUrl } } = supabase.storage
          .from('demos')
          .getPublicUrl(audioFileName)
        
        updates.audio_demo = audioPublicUrl
        console.log('New audio demo uploaded successfully:', audioPublicUrl)
      }

      console.log('Updating artist record...')
      const { error: updateError } = await supabase
        .from('artists')
        .update(updates)
        .eq('id', artist?.id)

      if (updateError) {
        console.error('Error updating artist:', updateError)
        throw updateError
      }

      console.log('Artist updated successfully')
      toast.success('Artist updated successfully')
      onSuccess()
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Failed to update artist: ' + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoFields
        firstname={firstname}
        lastname={lastname}
        email={email}
        setFirstname={setFirstname}
        setLastname={setLastname}
        setEmail={setEmail}
      />

      <VoiceGenderField
        voiceGender={voiceGender}
        setVoiceGender={setVoiceGender}
      />

      <LanguagesField
        languages={languages}
        availableLanguages={availableLanguages}
        setLanguages={setLanguages}
      />

      <FileUploadFields
        setAudioDemo={setAudioDemo}
        setAvatar={setAvatar}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating Artist...' : 'Update Artist'}
      </Button>
    </form>
  )
}
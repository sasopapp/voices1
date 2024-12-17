import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { VoiceoverArtist } from "@/types/voiceover"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { LanguageSelector } from "./form/LanguageSelector"
import { MediaUploadFields } from "./form/MediaUploadFields"

interface ArtistEditFormProps {
  artist: VoiceoverArtist & { 
    firstname: string
    lastname: string
    is_approved?: boolean 
  }
}

export const ArtistEditForm = ({ artist }: ArtistEditFormProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [firstname, setFirstname] = useState(artist.firstname)
  const [lastname, setLastname] = useState(artist.lastname)
  const [email, setEmail] = useState(artist.email)
  const [languages, setLanguages] = useState<string[]>(artist.languages)
  const [audioDemo, setAudioDemo] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [voiceGender, setVoiceGender] = useState<string>(artist.voice_gender || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstname || !lastname || !email || languages.length === 0 || !voiceGender) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      console.log('Starting artist update process...')

      let avatarUrl = artist.avatar
      let audioDemoUrl = artist.audioDemo

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

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName)
        
        avatarUrl = publicUrl
        console.log('New avatar uploaded successfully:', avatarUrl)
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

        const { data: { publicUrl } } = supabase.storage
          .from('demos')
          .getPublicUrl(audioFileName)
        
        audioDemoUrl = publicUrl
        console.log('New audio demo uploaded successfully:', audioDemoUrl)
      }

      console.log('Updating artist record...')
      const { error: updateError } = await supabase
        .from('artists')
        .update({
          firstname,
          lastname,
          name: `${firstname} ${lastname}`,
          email,
          languages,
          avatar: avatarUrl,
          audio_demo: audioDemoUrl,
          voice_gender: voiceGender,
        })
        .eq('id', artist.id)

      if (updateError) {
        console.error('Error updating artist:', updateError)
        throw updateError
      }

      console.log('Artist updated successfully')
      toast.success('Artist updated successfully')
      await queryClient.invalidateQueries({ queryKey: ['admin-artists'] })
      await queryClient.invalidateQueries({ queryKey: ['artist', artist.id] })
      navigate('/admin')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Failed to update artist: ' + (error as Error).message)
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

      <div>
        <Label>Languages</Label>
        <LanguageSelector
          languages={languages}
          onLanguageAdd={(lang) => setLanguages(prev => [...prev, lang])}
          onLanguageRemove={(lang) => setLanguages(languages.filter(l => l !== lang))}
        />
      </div>

      <MediaUploadFields
        onAudioChange={setAudioDemo}
        onAvatarChange={setAvatar}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating Artist...' : 'Update Artist'}
      </Button>
    </form>
  )
}
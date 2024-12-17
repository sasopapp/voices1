import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { VoiceoverArtist } from "@/types/voiceover"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { LanguageSelector } from "./form/LanguageSelector"
import { MediaUploadFields } from "./form/MediaUploadFields"
import { DemoManager } from "./form/DemoManager"

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
  const [username, setUsername] = useState(artist.username)
  const [languages, setLanguages] = useState<string[]>(artist.languages)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [voiceGender, setVoiceGender] = useState<string>(artist.voice_gender || '')
  const [bio, setBio] = useState(artist.bio)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstname || !lastname || !email || !username || languages.length === 0 || !voiceGender || !bio) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      console.log('Starting artist update process...')

      let avatarUrl = artist.avatar

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

      console.log('Updating artist record...')
      const { error: updateError } = await supabase
        .from('artists')
        .update({
          firstname,
          lastname,
          name: `${firstname} ${lastname}`,
          email,
          username,
          languages,
          avatar: avatarUrl,
          voice_gender: voiceGender,
          bio,
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
          placeholder="Enter artist bio"
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
        artistId={artist.id}
        initialDemos={artist.demos || []}
      />

      <MediaUploadFields
        onAvatarChange={setAvatar}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating Artist...' : 'Update Artist'}
      </Button>
    </form>
  )
}
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { VoiceoverArtist, Demo } from "@/types/voiceover"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { LanguageSelector } from "./form/LanguageSelector"
import { MediaUploadFields } from "./form/MediaUploadFields"
import { UsernameField } from "./form/UsernameField"
import { DemoUploadFields } from "./form/DemoUploadFields"

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
  const [demos, setDemos] = useState<Demo[]>(artist.demos || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDemoAdd = async (file: File, name: string, isMain: boolean) => {
    try {
      console.log('Uploading new demo:', name)
      const fileName = `${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('demos')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Demo upload error:', uploadError)
        throw new Error('Failed to upload demo')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('demos')
        .getPublicUrl(fileName)

      const { data: demoData, error: insertError } = await supabase
        .from('demos')
        .insert({
          artist_id: artist.id,
          name,
          url: publicUrl,
          is_main: isMain
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting demo:', insertError)
        throw insertError
      }

      console.log('Demo added successfully:', demoData)
      setDemos([...demos, demoData])
      toast.success('Demo added successfully')
    } catch (error) {
      console.error('Error in handleDemoAdd:', error)
      toast.error('Failed to add demo: ' + (error as Error).message)
    }
  }

  const handleDemoRemove = async (demoId: string) => {
    try {
      console.log('Removing demo:', demoId)
      const { error } = await supabase
        .from('demos')
        .delete()
        .eq('id', demoId)

      if (error) {
        console.error('Error removing demo:', error)
        throw error
      }

      setDemos(demos.filter(demo => demo.id !== demoId))
      toast.success('Demo removed successfully')
    } catch (error) {
      console.error('Error in handleDemoRemove:', error)
      toast.error('Failed to remove demo: ' + (error as Error).message)
    }
  }

  const handleDemoNameChange = async (demoId: string, name: string) => {
    try {
      console.log('Updating demo name:', demoId, name)
      const { error } = await supabase
        .from('demos')
        .update({ name })
        .eq('id', demoId)

      if (error) {
        console.error('Error updating demo name:', error)
        throw error
      }

      setDemos(demos.map(demo => 
        demo.id === demoId ? { ...demo, name } : demo
      ))
    } catch (error) {
      console.error('Error in handleDemoNameChange:', error)
      toast.error('Failed to update demo name: ' + (error as Error).message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstname || !lastname || !email || !username || languages.length === 0 || !voiceGender) {
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

      <UsernameField
        username={username}
        onUsernameChange={setUsername}
      />

      <div>
        <Label>Languages</Label>
        <LanguageSelector
          languages={languages}
          onLanguageAdd={(lang) => setLanguages(prev => [...prev, lang])}
          onLanguageRemove={(lang) => setLanguages(languages.filter(l => l !== lang))}
        />
      </div>

      <DemoUploadFields
        demos={demos}
        onDemoAdd={handleDemoAdd}
        onDemoRemove={handleDemoRemove}
        onDemoNameChange={handleDemoNameChange}
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
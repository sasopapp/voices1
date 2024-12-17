import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { VoiceoverArtist } from "@/types/voiceover"

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

  // Fetch available languages
  const { data: availableLanguages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching available languages...')
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      console.log('Languages loaded:', data)
      return data.map(lang => lang.name)
    },
  })

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

      <div>
        <Label>Languages</Label>
        <Select
          onValueChange={(value) => 
            setLanguages(prev => [...prev, value])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 flex flex-wrap gap-2">
          {languages.map((lang) => (
            <div
              key={lang}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
            >
              {lang}
              <button
                type="button"
                onClick={() => 
                  setLanguages(languages.filter((l) => l !== lang))
                }
                className="text-secondary-foreground/50 hover:text-secondary-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="audio">New Audio Demo (optional)</Label>
        <Input
          id="audio"
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioDemo(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <Label htmlFor="avatar">New Avatar (optional)</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating Artist...' : 'Update Artist'}
      </Button>
    </form>
  )
}
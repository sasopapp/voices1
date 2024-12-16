import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Language } from "@/types/voiceover"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"

const AdminEditArtist = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [name, setName] = useState("")
  const [languages, setLanguages] = useState<Language[]>([])
  const [audioDemo, setAudioDemo] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: artist, isLoading: isLoadingArtist } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      console.log('Fetching artist details for editing:', id)
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching artist:', error)
        throw error
      }

      return data
    },
  })

  useEffect(() => {
    if (artist) {
      setName(artist.name)
      setLanguages(artist.languages as Language[])
    }
  }, [artist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      console.log('Starting artist update process...')

      let updates: any = {
        name,
        languages,
      }

      // Upload new avatar if provided
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

      // Upload new audio demo if provided
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

      // Update artist record
      console.log('Updating artist record...')
      const { error: updateError } = await supabase
        .from('artists')
        .update(updates)
        .eq('id', id)

      if (updateError) {
        console.error('Error updating artist:', updateError)
        throw updateError
      }

      console.log('Artist updated successfully')
      toast.success('Artist updated successfully')
      navigate('/admin')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Failed to update artist: ' + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingArtist) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Edit Artist</h1>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Languages</Label>
              <Select
                onValueChange={(value) => 
                  setLanguages([...languages, value as Language])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
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
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AdminEditArtist
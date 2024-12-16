import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"

const AdminNewArtist = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [audioDemo, setAudioDemo] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { session } = useSessionContext()

  // Fetch available languages from the database
  const { data: availableLanguages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      console.log('Fetching languages from database...')
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .order('name')

      if (error) {
        console.error('Error fetching languages:', error)
        throw error
      }

      const languages = data.map(lang => lang.name)
      console.log('Available languages from DB:', languages)
      return languages
    },
  })

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('No user found, redirecting to login')
        navigate('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (error || !profile?.is_admin) {
        console.log('User is not admin, redirecting to home')
        navigate('/')
      }
    }

    checkAdmin()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast.error('You must be logged in to create an artist')
      return
    }

    try {
      setIsSubmitting(true)
      console.log('Starting artist creation process...')

      // Upload avatar if provided
      let avatarUrl = null
      if (avatar) {
        console.log('Uploading avatar...')
        const avatarFileName = `${Date.now()}-${avatar.name}`
        const { data: avatarData, error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatar)

        if (avatarError) {
          console.error('Avatar upload error:', avatarError)
          throw new Error('Failed to upload avatar')
        }

        const { data: { publicUrl: avatarPublicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName)
        
        avatarUrl = avatarPublicUrl
        console.log('Avatar uploaded successfully:', avatarUrl)
      }

      // Upload audio demo if provided
      let audioDemoUrl = null
      if (audioDemo) {
        console.log('Uploading audio demo...')
        const audioFileName = `${Date.now()}-${audioDemo.name}`
        const { data: audioData, error: audioError } = await supabase.storage
          .from('demos')
          .upload(audioFileName, audioDemo)

        if (audioError) {
          console.error('Audio demo upload error:', audioError)
          throw new Error('Failed to upload audio demo')
        }

        const { data: { publicUrl: audioPublicUrl } } = supabase.storage
          .from('demos')
          .getPublicUrl(audioFileName)
        
        audioDemoUrl = audioPublicUrl
        console.log('Audio demo uploaded successfully:', audioDemoUrl)
      }

      // Create artist record
      console.log('Creating artist record...')
      const { error: insertError } = await supabase.from('artists').insert({
        name,
        languages,
        audio_demo: audioDemoUrl,
        avatar: avatarUrl,
        created_by: session.user.id,
        is_approved: false
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
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Add New Artist" />
      <main className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
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
                setLanguages([...languages, value])
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
            <Label htmlFor="audio">Audio Demo</Label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioDemo(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div>
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Artist...' : 'Create Artist'}
          </Button>
        </form>
      </main>
    </div>
  )
}

export default AdminNewArtist

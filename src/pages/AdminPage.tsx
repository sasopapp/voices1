import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"
import { useSessionContext } from "@supabase/auth-helpers-react"

const AdminNewArtist = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [audioDemo, setAudioDemo] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { session } = useSessionContext()

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
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Add New Artist</h1>
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
                  setLanguages([...languages, value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {/* Languages will be fetched from the database */}
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
    </SidebarProvider>
  )
}

export default AdminNewArtist
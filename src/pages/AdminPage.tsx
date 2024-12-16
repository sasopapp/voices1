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
import { Language } from "@/types/voiceover"

const AdminNewArtist = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("")
  const [languages, setLanguages] = useState<Language[]>([])
  const [audioDemo, setAudioDemo] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let avatarUrl = null
      let audioDemoUrl = null

      if (avatar) {
        const { data: avatarData, error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(`${Date.now()}-${avatar.name}`, avatar)

        if (avatarError) throw avatarError
        avatarUrl = avatarData.path
      }

      if (audioDemo) {
        const { data: audioData, error: audioError } = await supabase.storage
          .from('demos')
          .upload(`${Date.now()}-${audioDemo.name}`, audioDemo)

        if (audioError) throw audioError
        audioDemoUrl = audioData.path
      }

      const { error } = await supabase.from('artists').insert({
        name,
        languages,
        audio_demo: audioDemoUrl,
        avatar: avatarUrl,
        is_approved: false
      })

      if (error) throw error

      navigate('/admin')
    } catch (error) {
      console.error('Error creating artist:', error)
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

            <Button type="submit">Create Artist</Button>
          </form>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AdminNewArtist
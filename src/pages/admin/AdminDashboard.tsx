import { useQuery } from "@tanstack/react-query"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { VoiceoverArtist, Language } from "@/types/voiceover"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
  const navigate = useNavigate();

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

  const { data: artists, isLoading } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching artists:', error);
        throw error;
      }

      return data.map(artist => ({
        id: artist.id,
        name: artist.name,
        languages: artist.languages.filter((lang): lang is Language => 
          ['English', 'Spanish', 'French', 'German', 'Italian'].includes(lang)
        ),
        audioDemo: artist.audio_demo,
        avatar: artist.avatar,
        is_approved: artist.is_approved
      }))
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Manage Artists</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists?.map((artist) => (
              <AdminArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AdminDashboard
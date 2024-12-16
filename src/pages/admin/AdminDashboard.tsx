import { useQuery } from "@tanstack/react-query"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Language } from "@/types/voiceover"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const { data: artists, isLoading, error } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      console.log('Fetching artists as admin...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);

      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching artists:', error);
        toast({
          title: "Error",
          description: "Failed to load artists",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Artists data:', data);
      if (!data) return [];
      
      return data.map(artist => ({
        id: artist.id,
        name: artist.name,
        languages: artist.languages.filter((lang): lang is Language => 
          ['English', 'Spanish', 'French', 'German', 'Italian'].includes(lang)
        ),
        audioDemo: artist.audio_demo,
        avatar: artist.avatar,
        is_approved: artist.is_approved
      }));
    },
  });

  if (error) {
    console.error('Query error:', error);
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="text-red-500">Error loading artists</div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="animate-pulse">Loading artists...</div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Manage Artists</h1>
          {artists && artists.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist) => (
                <AdminArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No artists found</div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
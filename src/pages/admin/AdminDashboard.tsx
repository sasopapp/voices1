import { useQuery } from "@tanstack/react-query"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { supabase } from "@/integrations/supabase/client"

const AdminDashboard = () => {
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
        throw error;
      }

      console.log('Artists data:', data);
      return data || [];
    },
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-8">Manage Artists</h1>
          {error && (
            <div className="text-red-500">Error loading artists</div>
          )}
          {isLoading ? (
            <div className="animate-pulse">Loading artists...</div>
          ) : artists && artists.length > 0 ? (
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
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminArtistCard } from "@/components/admin/AdminArtistCard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const AdminDashboard = () => {
  const { data: artists, isLoading } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
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
import { AdminHeader } from "@/components/admin/AdminHeader"
import { NewArtistForm } from "@/components/admin/NewArtistForm"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const AdminNewArtist = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title={
        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2" form="new-artist-form" type="submit">
            <Plus className="h-4 w-4" />
            Create Artist
          </Button>
        </div>
      } />
      <main className="flex-1 p-8">
        <NewArtistForm />
      </main>
      <Footer />
    </div>
  )
}

export default AdminNewArtist
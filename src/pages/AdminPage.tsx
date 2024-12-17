import { AdminHeader } from "@/components/admin/AdminHeader"
import { NewArtistForm } from "@/components/admin/NewArtistForm"
import { Footer } from "@/components/Footer"

const AdminNewArtist = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="New Artist" />
      <main className="flex-1 p-8">
        <NewArtistForm />
      </main>
      <Footer />
    </div>
  )
}

export default AdminNewArtist
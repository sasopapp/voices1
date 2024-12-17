import { AdminHeader } from "@/components/admin/AdminHeader"
import { LanguageManager } from "@/components/admin/LanguageManager"
import { Footer } from "@/components/Footer"

const AdminLanguages = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader title="Language Management" />
      <main className="flex-1 container mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <LanguageManager />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminLanguages
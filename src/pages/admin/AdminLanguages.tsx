import { AdminHeader } from "@/components/admin/AdminHeader"
import { LanguageManager } from "@/components/admin/LanguageManager"

const AdminLanguages = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Language Management" />
      <main className="flex-1 p-8">
        <LanguageManager />
      </main>
    </div>
  )
}

export default AdminLanguages
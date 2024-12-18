import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { DesktopNav } from "./navigation/DesktopNav"
import { MobileNav } from "./navigation/MobileNav"

export function AdminHeader({ title }: { title: string }) {
  const navigate = useNavigate()

  return (
    <header className="border-b bg-white relative z-10">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Go to home page</span>
          </Button>
          
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <div className="flex-1 flex justify-center">
          <img 
            src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png"
            alt="Authentic Voices Logo"
            className="h-24 w-auto"
          />
        </div>

        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  )
}
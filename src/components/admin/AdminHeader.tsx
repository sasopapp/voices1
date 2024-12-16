import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function AdminHeader({ title }: { title: string }) {
  const navigate = useNavigate()

  return (
    <header className="border-b">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Go back</span>
        </Button>
        <img 
          src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png"
          alt="Authentic Voices Logo"
          className="h-8 w-auto mr-4"
        />
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </div>
    </header>
  )
}
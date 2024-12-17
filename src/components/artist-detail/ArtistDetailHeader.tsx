import { Button } from "@/components/ui/button"
import { Edit, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ArtistDetailHeaderProps {
  artistId: string
  isAdmin: boolean
}

export const ArtistDetailHeader = ({ artistId, isAdmin }: ArtistDetailHeaderProps) => {
  const navigate = useNavigate()

  return (
    <header className="border-b bg-white relative z-10">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Go back</span>
          </Button>
          
          <h1 className="text-lg font-semibold">Voice Artist Profile</h1>
        </div>

        <div className="flex-1 flex justify-center">
          <img 
            src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png"
            alt="Authentic Voices Logo"
            className="h-24 w-auto"
          />
        </div>

        <div className="flex items-center justify-end">
          {isAdmin && (
            <Button
              variant="ghost"
              onClick={() => navigate(`/admin/edit/${artistId}`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Artist
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
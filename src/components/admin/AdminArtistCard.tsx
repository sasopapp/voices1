import { VoiceoverArtist } from "@/types/voiceover"
import { ArtistCard } from "@/components/ArtistCard"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface AdminArtistCardProps {
  artist: VoiceoverArtist & { is_approved?: boolean }
}

export const AdminArtistCard = ({ artist }: AdminArtistCardProps) => {
  const navigate = useNavigate()

  return (
    <div className="relative">
      <div className={`absolute -right-2 -top-2 z-10 ${!artist.is_approved ? 'bg-yellow-100 text-yellow-800' : ''} rounded-full px-2 py-1 text-xs font-medium`}>
        {artist.is_approved ? 'Approved' : 'Pending'}
      </div>
      <div className="group relative">
        <ArtistCard artist={artist} />
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/admin/edit/${artist.id}`)
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
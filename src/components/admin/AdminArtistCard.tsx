import { VoiceoverArtist } from "@/types/voiceover"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { ArtistStatusBadge } from "./artist-card/ArtistStatusBadge"
import { ArtistCardHeader } from "./artist-card/ArtistCardHeader"
import { ArtistActions } from "./artist-card/ArtistActions"
import { CustomAudioPlayer } from "../CustomAudioPlayer"

interface AdminArtistCardProps {
  artist: VoiceoverArtist & { is_approved?: boolean }
}

export const AdminArtistCard = ({ artist }: AdminArtistCardProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      console.log('Approving artist:', artist.id)
      const { error } = await supabase
        .from('artists')
        .update({ is_approved: true })
        .eq('id', artist.id)

      if (error) {
        console.error('Error approving artist:', error)
        toast.error('Failed to approve artist')
        return
      }

      console.log('Artist approved successfully')
      toast.success('Artist approved successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] })
    } catch (error) {
      console.error('Error in handleApprove:', error)
      toast.error('An error occurred while approving the artist')
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      console.log('Deleting artist:', artist.id)
      
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', artist.id)

      if (error) {
        console.error('Error deleting artist:', error)
        toast.error('Failed to delete artist')
        return
      }

      console.log('Artist deleted successfully')
      toast.success('Artist deleted successfully')
      
      await queryClient.invalidateQueries({ queryKey: ['admin-artists'] })
      await queryClient.refetchQueries({ queryKey: ['admin-artists'], exact: true })
    } catch (error) {
      console.error('Error in handleDelete:', error)
      toast.error('An error occurred while deleting the artist')
    }
  }

  const mainDemo = artist.demos?.find(demo => demo.is_main)

  const handleCardClick = () => {
    navigate(`/artist/${artist.id}`)
  }

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all" 
      onClick={handleCardClick}
    >
      <ArtistStatusBadge isApproved={artist.is_approved || false} />
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <ArtistCardHeader artist={artist} />
        <ArtistActions 
          artistId={artist.id}
          isApproved={artist.is_approved || false}
          onApprove={handleApprove}
          onDelete={handleDelete}
          onDropdownClick={handleDropdownClick}
        />
      </CardHeader>
      <CardContent>
        {mainDemo && (
          <CustomAudioPlayer url={mainDemo.url} />
        )}
      </CardContent>
    </Card>
  )
}

export default AdminArtistCard

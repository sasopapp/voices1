import { VoiceoverArtist } from "@/types/voiceover"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, MoreVertical, Mic2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

interface AdminArtistCardProps {
  artist: VoiceoverArtist & { is_approved?: boolean }
}

export const AdminArtistCard = ({ artist }: AdminArtistCardProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation when clicking approve button
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
    e.stopPropagation() // Prevent navigation when clicking delete
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

  // Ensure languages is always an array
  const languages = Array.isArray(artist.languages) ? artist.languages : []

  // Find the main demo
  const mainDemo = artist.demos?.find(demo => demo.is_main)

  const handleCardClick = () => {
    navigate(`/artist/${artist.id}`)
  }

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation when clicking dropdown
  }

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all" 
      onClick={handleCardClick}
    >
      <div className={`absolute right-2 top-2 z-10 ${!artist.is_approved ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'} rounded-full px-3 py-1 text-xs font-medium`}>
        {artist.is_approved ? 'Approved' : 'Pending'}
      </div>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={artist.avatar || ''} alt={artist.username} />
          <AvatarFallback>{artist.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-lg">@{artist.username}</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              {artist.languages.length > 0 ? artist.languages.join(", ") : "No languages specified"}
            </div>
            {artist.voice_gender && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mic2 className="h-4 w-4" />
                {artist.voice_gender.charAt(0).toUpperCase() + artist.voice_gender.slice(1)}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {!artist.is_approved && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleApprove}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              Approve
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/admin/edit/${artist.id}`)
                }}
                className="bg-white hover:bg-gray-100"
              >
                Edit Artist
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 bg-white hover:bg-red-50"
              >
                Delete Artist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {mainDemo && (
          <div className="rounded-lg bg-slate-100 p-4">
            <audio controls className="w-full h-12">
              <source src={mainDemo.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminArtistCard
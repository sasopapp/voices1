import { VoiceoverArtist } from "@/types/voiceover"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, MoreVertical } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

  const handleApprove = async () => {
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
      // Invalidate and refetch the artists query
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] })
    } catch (error) {
      console.error('Error in handleApprove:', error)
      toast.error('An error occurred while approving the artist')
    }
  }

  // Ensure languages is always an array and contains valid languages
  const languages = Array.isArray(artist.languages) ? artist.languages : []
  console.log('Languages for artist:', artist.name, languages)

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute right-2 top-2 z-10 ${!artist.is_approved ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'} rounded-full px-3 py-1 text-xs font-medium`}>
        {artist.is_approved ? 'Approved' : 'Pending'}
      </div>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={artist.avatar || ''} alt={artist.name} />
          <AvatarFallback>{artist.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-lg">{artist.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            {languages.length > 0 ? languages.join(", ") : "No languages specified"}
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/admin/edit/${artist.id}`)}>
                Edit Artist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-slate-100 p-4">
          <audio controls className="w-full h-12">
            <source src={artist.audioDemo || ''} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </CardContent>
    </Card>
  )
}
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface ArtistActionsProps {
  artistId: string;
  isApproved: boolean;
  onApprove: (e: React.MouseEvent) => Promise<void>;
  onDelete: (e: React.MouseEvent) => Promise<void>;
  onDropdownClick: (e: React.MouseEvent) => void;
}

export const ArtistActions = ({ 
  artistId, 
  isApproved, 
  onApprove, 
  onDelete,
  onDropdownClick 
}: ArtistActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {!isApproved && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onApprove}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          Approve
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={onDropdownClick}>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/edit/${artistId}`);
            }}
            className="bg-white hover:bg-gray-100"
          >
            Edit Artist
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 bg-white hover:bg-red-50"
          >
            Delete Artist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
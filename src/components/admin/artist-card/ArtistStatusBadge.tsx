interface ArtistStatusBadgeProps {
  isApproved: boolean;
}

export const ArtistStatusBadge = ({ isApproved }: ArtistStatusBadgeProps) => {
  return (
    <div 
      className={`absolute right-2 top-2 z-10 ${
        !isApproved ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
      } rounded-full px-3 py-1 text-xs font-medium`}
    >
      {isApproved ? 'Approved' : 'Pending'}
    </div>
  );
};
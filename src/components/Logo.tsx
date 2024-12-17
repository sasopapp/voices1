import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export const Logo = ({ className }: LogoProps) => {
  const navigate = useNavigate()
  
  return (
    <div 
      className={cn("flex items-center justify-center cursor-pointer", className)}
      onClick={() => navigate('/')}
    >
      <img 
        src="https://authenticvoices.eu/wp-content/uploads/2023/11/AV_logo_250px-1.png" 
        alt="Authentic Voices Logo" 
        className="h-12 w-auto"
      />
    </div>
  )
}
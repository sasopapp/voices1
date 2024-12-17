import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("font-bold text-xl", className)}>
      VoiceOver
    </div>
  )
}
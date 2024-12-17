import { ReactNode } from "react"
import { Logo } from "@/components/Logo"

interface AdminHeaderProps {
  title: ReactNode
}

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <Logo />
        <div className="ml-auto flex items-center space-x-4">
          {title}
        </div>
      </div>
    </header>
  )
}
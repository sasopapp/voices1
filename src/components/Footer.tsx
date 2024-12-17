import { Copyright } from "lucide-react"
import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Copyright className="h-4 w-4" />
            <span>{new Date().getFullYear()} Authentic Voices. All rights reserved.</span>
          </div>
          <div className="text-xs text-gray-400">
            Version 0.823 BETA
          </div>
        </div>
      </div>
    </footer>
  )
}
import { Copyright, Facebook, Instagram } from "lucide-react"
import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Copyright className="h-4 w-4" />
            <span>{new Date().getFullYear()} Authentic Voices. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
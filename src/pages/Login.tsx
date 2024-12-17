import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { Footer } from "@/components/Footer"

const Login = () => {
  const { session, isLoading } = useSessionContext()
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Login page - Session status:", { session, isLoading })
    
    if (session) {
      console.log("User is authenticated, redirecting to home")
      navigate("/")
    }
  }, [session, navigate])

  // Only show loading state for initial session check
  if (isLoading && !session) {
    console.log("Initial session check...")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome to AuthenticVoices</h1>
            <p className="text-muted-foreground">Sign in to submit your voice demo</p>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
              redirectTo={`${window.location.origin}/`}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
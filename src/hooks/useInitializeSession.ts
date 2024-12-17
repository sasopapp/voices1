import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export const useInitializeSession = () => {
  const [initialSession, setInitialSession] = useState(null)

  useEffect(() => {
    // Clear any existing session data to prevent stale tokens
    const clearSession = async () => {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Error clearing session:', error)
        }
      } catch (error) {
        console.error('Error during session cleanup:', error)
      }
    }

    // Initialize session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session:', session)
        setInitialSession(session)
      } catch (error) {
        console.error('Error getting session:', error)
        await clearSession()
      }
    }

    initSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session)
      setInitialSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return initialSession
}
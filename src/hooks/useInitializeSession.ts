import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export const useInitializeSession = () => {
  const [initialSession, setInitialSession] = useState(null)

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setInitialSession(session)
    })

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session)
      setInitialSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return initialSession
}
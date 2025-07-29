'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

const AuthContext = createContext({})

// custom hook --- so we can easyly access the VALUE object below
// other wise we would need to repeat these lines many times to extract these values 
export const useAuth = () => {
  const context = useContext(AuthContext)
  // console.log(context)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// imported into main.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    // prettier-ignore
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }
  // console.log(user)

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

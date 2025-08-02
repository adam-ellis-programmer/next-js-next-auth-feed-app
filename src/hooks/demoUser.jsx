'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserProfile } from '@/lib/data'

export const useDemoUser = () => {
  const { user, loading: authLoading } = useAuth()
  const [isDemoUser, setIsDemoUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Reset states
      setLoading(true)
      setError(null)
      setIsDemoUser(false)
      setUserProfile(null)

      // If no user or auth is still loading, don't fetch
      if (!user || authLoading) {
        setLoading(false)
        return
      }

      try {
        // Use the centralized data function
        const profile = await getUserProfile(user.id)

        if (profile) {
          setUserProfile(profile)
          setIsDemoUser(profile.demo_user === true)
        } else {
          setError('User profile not found')
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Failed to fetch user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, authLoading])

  // Function to manually refresh user profile
  const refreshProfile = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const profile = await getUserProfile(user.id)

      if (profile) {
        setUserProfile(profile)
        setIsDemoUser(profile.demo_user === true)
      } else {
        setError('User profile not found')
      }
    } catch (err) {
      setError('Failed to refresh user profile')
    } finally {
      setLoading(false)
    }
  }

  return {
    isDemoUser,
    userProfile,
    loading,
    error,
    refreshProfile,
    // Additional helper properties
    isDemo: isDemoUser, // Alias for convenience
    demoStatus: isDemoUser ? 'demo' : 'full',
    canPerformAction: !isDemoUser && !loading,
  }
}

'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const DashBoard = () => {
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/sign-in')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 mt-10'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
            <button
              onClick={signOut}
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors'
            >
              Sign Out
            </button>
          </div>

          <div className='border-b border-gray-200 pb-6 mb-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Welcome back!
            </h2>
            <p className='text-gray-600'>Email: {user?.email}</p>
            <p className='text-gray-600'>User ID: {user?.id}</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-blue-900 mb-2'>Create Post</h3>
              <p className='text-blue-700 text-sm mb-3'>
                Share your thoughts with the community
              </p>
              <button
                onClick={() => router.push('/posts/create')}
                className='bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700'
              >
                New Post
              </button>
            </div>

            <div className='bg-green-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-green-900 mb-2'>View Feed</h3>
              <p className='text-green-700 text-sm mb-3'>
                See what others are sharing
              </p>
              <button
                onClick={() => router.push('/feed')}
                className='bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700'
              >
                View Feed
              </button>
            </div>

            <div className='bg-purple-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-purple-900 mb-2'>My Posts</h3>
              <p className='text-purple-700 text-sm mb-3'>
                Manage your content
              </p>
              <button
                onClick={() => router.push('/posts')}
                className='bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700'
              >
                My Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard

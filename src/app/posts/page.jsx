// app/posts/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext' // Assuming you have auth context
import MyPostsPagination from '@/components/pagination/MyPostsPagination'
import PostsTable from '@/components/posts/PostsTable'
import BulkActions from '@/components/posts/BulkActions'

const PostsPage = () => {
  const { user } = useAuth() // Get current user
  const [posts, setPosts] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  })
  const [selectedPosts, setSelectedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bulkLoading, setBulkLoading] = useState(false)

  // Fetch user posts
  const fetchPosts = async (page = 1) => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(
        `/api/posts/user?userId=${user.id}&page=${page}&limit=${pagination.limit}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts)
      setPagination(data.pagination)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchPosts(1)
    }
  }, [user?.id])

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchPosts(newPage)
    setSelectedPosts([]) // Clear selections when changing pages
  }

  // Handle post selection
  const handlePostSelect = (postId, isSelected) => {
    if (isSelected) {
      setSelectedPosts((prev) => [...prev, postId])
    } else {
      setSelectedPosts((prev) => prev.filter((id) => id !== postId))
    }
  }

  // Handle select all
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedPosts(posts.map((post) => post.id))
    } else {
      setSelectedPosts([])
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return

    setBulkLoading(true)
    try {
      const response = await fetch('/api/posts/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postIds: selectedPosts,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete posts')
      }

      // Refresh the current page
      await fetchPosts(pagination.currentPage)
      setSelectedPosts([])

      // Show success message (you can implement toast notifications)
      console.log(`Successfully deleted ${selectedPosts.length} posts`)
    } catch (err) {
      console.error('Error deleting posts:', err)
      // Show error message
    } finally {
      setBulkLoading(false)
    }
  }

  // Handle bulk update (example: update visibility)
  const handleBulkUpdate = async (updates) => {
    if (selectedPosts.length === 0) return

    setBulkLoading(true)
    try {
      const response = await fetch('/api/posts/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postIds: selectedPosts,
          updates,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update posts')
      }

      // Refresh the current page
      await fetchPosts(pagination.currentPage)
      setSelectedPosts([])

      console.log(`Successfully updated ${selectedPosts.length} posts`)
    } catch (err) {
      console.error('Error updating posts:', err)
    } finally {
      setBulkLoading(false)
    }
  }

  // Loading state
  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Please log in
          </h2>
          <p className='text-gray-600'>
            You need to be logged in to view your posts.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Loading your posts
          </h2>
          <p className='text-gray-600'>Please wait...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Error loading posts
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => fetchPosts(pagination.currentPage)}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>My Posts</h1>
          <p className='text-gray-600'>
            Manage your {pagination.totalCount} posts
          </p>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className='mb-6'>
            <BulkActions
              selectedCount={selectedPosts.length}
              onDelete={handleBulkDelete}
              onUpdate={handleBulkUpdate}
              loading={bulkLoading}
            />
          </div>
        )}

        {/* Posts Table */}
        {posts.length > 0 ? (
          <>
            <PostsTable
              posts={posts}
              selectedPosts={selectedPosts}
              onPostSelect={handlePostSelect}
              onSelectAll={handleSelectAll}
            />

            {/* Pagination */}
            <div className='mt-8'>
              <MyPostsPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                hasNext={pagination.hasNextPage}
                hasPrev={pagination.hasPrevPage}
              />
            </div>
          </>
        ) : (
          <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 text-center shadow-xl'>
            <div className='w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8'>
              <svg
                className='w-12 h-12 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              No posts yet!
            </h2>
            <p className='text-gray-600 mb-8 text-lg'>
              Start sharing your thoughts and experiences with the community.
            </p>
            <a
              href='/posts/create'
              className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg'
            >
              Create Your First Post
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostsPage

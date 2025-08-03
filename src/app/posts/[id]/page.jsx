// src/app/posts/[id]/page.jsx
'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getPostById } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'

const ViewPostPage = ({ params }) => {
  const router = useRouter()
  const { user } = useAuth()
  const resolvedParams = use(params) // Unwrap the params Promise
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Fetch post data using data function
  useEffect(() => {
    const fetchPost = async () => {
      if (!resolvedParams.id) return

      try {
        setLoading(true)
        const postData = await getPostById(resolvedParams.id)

        if (!postData) {
          setError('Post not found')
          return
        }

        setPost(postData)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Loading post...
          </h2>
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
            Error loading post
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => router.back()}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Post not found
          </h2>
          <p className='text-gray-600 mb-4'>
            The post you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Check if current user owns this post
  const isOwner = user && user.id === post.user_id

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='max-w-2xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => router.back()}
            className='text-blue-600 hover:text-blue-800 text-sm font-medium mb-4'
          >
            ← Back
          </button>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <h1 className='text-3xl font-bold text-gray-900'>Post Details</h1>
            {isOwner && (
              <Link
                href={`/posts/${post.id}/edit`}
                className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                Edit Post
              </Link>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl'>
          {/* Post Image */}
          {post.image_url && (
            <div className='mb-4'>
              <div className='relative w-full h-64 rounded-xl overflow-hidden'>
                <Image
                  src={post.image_url}
                  alt='Post image'
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              </div>
            </div>
          )}

          {/* Post Text */}
          <div className='mb-4'>
            <p className='text-base text-gray-900 leading-relaxed whitespace-pre-wrap'>
              {post.content}
            </p>
          </div>

          {/* Post Meta */}
          <div className='border-t border-gray-200/50 pt-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600'>
              {/* Date Info */}
              <div>
                <p>Created: {formatDate(post.created_at)}</p>
                {post.updated_at !== post.created_at && (
                  <p>Updated: {formatDate(post.updated_at)}</p>
                )}
              </div>

              {/* Stats */}
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <span className='text-red-500'>❤️</span>
                  <span className='font-medium'>
                    {post.likes_count || 0} likes
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-blue-500'>💬</span>
                  <span className='font-medium'>
                    {post.comments_count || 0} comments
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Author Info (if available) */}
          {post.author && (
            <div className='border-t border-gray-200/50 pt-4 mt-4'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                  <span className='text-white font-semibold text-sm'>
                    {(() => {
                      const displayName =
                        post.author?.username ||
                        post.author?.full_name ||
                        post.author?.first_name ||
                        post.author?.email ||
                        'U'
                      return displayName.charAt(0).toUpperCase()
                    })()}
                  </span>
                </div>
                <div>
                  <p className='font-medium text-gray-900 text-sm'>
                    By{' '}
                    {post.author?.username ||
                      post.author?.full_name ||
                      (post.author?.first_name && post.author?.last_name
                        ? `${post.author.first_name} ${post.author.last_name}`
                        : post.author?.first_name) ||
                      post.author?.email ||
                      'Unknown User'}
                  </p>
                  <p className='text-xs text-gray-600'>Author</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='mt-6 flex flex-col sm:flex-row items-center gap-3'>
          <button
            onClick={() => router.push('/feed')}
            className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg'
          >
            View Feed
          </button>

          {user && (
            <button
              onClick={() => router.push('/posts')}
              className='bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors'
            >
              My Posts
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewPostPage

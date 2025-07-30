// components/posts/PostCard.jsx
'use client'
import { useState, useEffect } from 'react'
import Comments from './Comments'
import LazyImage from '@/components/common/LazyImage'

export const PostCard = ({ post }) => {
  const [reactions, setReactions] = useState(
    post.reactions || {
      like: 0,
      love: 0,
      laugh: 0,
      wow: 0,
      sad: 0,
      angry: 0,
    }
  )

  const [userReaction, setUserReaction] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleReaction = async (reactionType) => {
    try {
      // Optimistic update
      const newReactions = { ...reactions }

      // Remove previous reaction
      if (userReaction) {
        newReactions[userReaction] = Math.max(0, newReactions[userReaction] - 1)
      }

      // Add new reaction (or remove if clicking same)
      if (userReaction !== reactionType) {
        newReactions[reactionType] = (newReactions[reactionType] || 0) + 1
        setUserReaction(reactionType)
      } else {
        setUserReaction(null)
      }

      setReactions(newReactions)

      // Send to API
      const response = await fetch(`/api/posts/${post.id}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reactionType: userReaction === reactionType ? null : reactionType,
        }),
      })

      if (!response.ok) {
        // Revert on error
        setReactions(post.reactions)
        setUserReaction(null)
      }
    } catch (error) {
      console.error('Failed to update reaction:', error)
      // Revert on error
      setReactions(post.reactions)
      setUserReaction(null)
    }
  }

  // Handle image view tracking (for future analytics)
  const handleImageView = ({ src, alt }) => {
    // You can implement view tracking here
    console.log(`Image viewed: ${post.id}`)
    // Example: Track in analytics service
    // analytics.track('post_image_viewed', { postId: post.id, imageUrl: src })
  }

  const reactionButtons = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'laugh', emoji: '😂', label: 'Haha' },
    { type: 'wow', emoji: '😲', label: 'Wow' },
    { type: 'sad', emoji: '😢', label: 'Sad' },
    { type: 'angry', emoji: '😡', label: 'Angry' },
  ]

  // Format date consistently for server and client
  const formatDate = (dateString) => {
    if (!isClient) return '' // Return empty string during SSR
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <article className='rounded-2xl h-auto mb-7 shadow-2xl bg-white relative overflow-hidden'>
      {/* Lazy-loaded image */}
      <div className='h-60 w-full relative'>
        <LazyImage
          src={post.image_url}
          alt={`Post by ${post.author?.username || 'User'}`}
          className='h-60 w-full object-cover rounded-tl-2xl rounded-tr-2xl'
          onView={handleImageView}
          threshold={0.1}
          rootMargin='100px'
          rootSelector='#feed-container' // Pass selector instead of element
        />
      </div>

      {/* Post Content */}
      <div className='p-4'>
        {/* Author info (if available) */}
        {post.author && (
          <div className='flex items-center mb-3 pb-2 border-b border-gray-100'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3'>
              {post.author.first_name?.[0] || post.author.username?.[0] || 'U'}
            </div>
            <div>
              <p className='font-medium text-gray-900 text-sm'>
                {post.author.full_name || post.author.username}
              </p>
              <p className='text-xs text-gray-500'>
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>
        )}

        <p className='text-gray-800 mb-3'>{post.content}</p>

        {/* Reaction Counts */}
        <div className='flex items-center gap-2 mb-3 text-sm text-gray-600'>
          {Object.entries(reactions).map(
            ([type, count]) =>
              count > 0 && (
                <span key={type} className='flex items-center gap-1'>
                  {reactionButtons.find((r) => r.type === type)?.emoji} {count}
                </span>
              )
          )}
        </div>

        {/* Reaction Buttons */}
        <div className='flex justify-between items-center border-t pt-3'>
          {reactionButtons.map(({ type, emoji, label }) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all hover:bg-gray-100 ${
                userReaction === type
                  ? 'bg-blue-50 text-blue-600 scale-110'
                  : 'text-gray-600'
              }`}
            >
              <span className='text-lg mb-1'>{emoji}</span>
              <span className='text-xs'>{label}</span>
            </button>
          ))}
        </div>

        {/* Comments Toggle Button */}
        <div className='border-t mt-3 pt-3'>
          <button
            onClick={() => setShowComments(!showComments)}
            className='flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors w-full justify-center py-2 hover:bg-gray-50 rounded-lg'
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                showComments ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
            <span className='text-sm font-medium'>
              {showComments ? 'Hide Comments' : 'View Comments'}
            </span>
            {post.commentCount && (
              <span className='text-xs text-gray-500'>
                ({post.commentCount})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && <Comments postId={post.id} />}
    </article>
  )
}

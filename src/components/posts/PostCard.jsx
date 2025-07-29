'use client'
import { useState } from 'react'
import Comments from './Comments'

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

  const reactionButtons = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'laugh', emoji: '😂', label: 'Haha' },
    { type: 'wow', emoji: '😲', label: 'Wow' },
    { type: 'sad', emoji: '😢', label: 'Sad' },
    { type: 'angry', emoji: '😡', label: 'Angry' },
  ]

  return (
    <article className='rounded-2xl h-auto mb-7 shadow-2xl bg-white relative'>
      <img
        src={post.image_url}
        className='h-60 w-full object-cover rounded-tl-2xl rounded-tr-2xl'
        alt=''
      />

      {/* Post Content */}
      <div className='p-4'>
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

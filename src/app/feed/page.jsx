'use client'
import React, { useState } from 'react'

const tempImg = 'https://images.pexels.com/photos/753885/pexels-photo-753885.jpeg'

const PostCard = ({ post }) => {
  const [reactions, setReactions] = useState(post.reactions || {
    like: 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0
  })
  
  const [userReaction, setUserReaction] = useState(null)

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
          reactionType: userReaction === reactionType ? null : reactionType 
        })
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
    { type: 'angry', emoji: '😡', label: 'Angry' }
  ]

  return (
    <article className='rounded-2xl h-auto mb-7 shadow-2xl bg-white '>
      <img src={post.image} className='h-60 w-full object-cover rounded-tl-2xl rounded-tr-2xl' alt='' />
      
      {/* Post Content */}
      <div className='p-4'>
        <p className='text-gray-800 mb-3'>
          {post.content}
        </p>
        
        {/* Reaction Counts */}
        <div className='flex items-center gap-2 mb-3 text-sm text-gray-600'>
          {Object.entries(reactions).map(([type, count]) => 
            count > 0 && (
              <span key={type} className='flex items-center gap-1'>
                {reactionButtons.find(r => r.type === type)?.emoji} {count}
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
      </div>
    </article>
  )
}

const page = () => {
  // Mock data - this would come from your database
  const posts = [
    {
      id: 1,
      content: "🔥 Amazing sunset vibes! 🌅 Perfect end to an incredible day 😍 Nature never fails to amaze me ✨ #blessed #sunset #photography",
      image: tempImg,
      reactions: { like: 12, love: 8, wow: 3 }
    },
    {
      id: 2,
      content: "☕ Morning coffee hits different when you're watching the sunrise 🌄 Starting the day right! 💪 Who else is an early bird? 🐦 #morningvibes",
      image: tempImg,
      reactions: { like: 24, laugh: 2, love: 15 }
    },
    {
      id: 3,
      content: "🎨 Art is everywhere if you just look! 👀 Found this beautiful scene during my walk today 🚶‍♂️ Sometimes the best moments are unplanned 💫",
      image: tempImg,
      reactions: { like: 7, wow: 4, love: 3 }
    }
  ]

  return (
    <div className='grid h-screen max-w-[500px] mx-auto mt-10'>
      <div className=''>
        <div className='h-140 overflow-scroll space-y-4 p-4'>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page
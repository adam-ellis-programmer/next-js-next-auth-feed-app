import React, { useState } from 'react'

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([
    // Mock data - replace with actual API call
    {
      id: 1,
      user: 'John Doe',
      avatar: 'https://via.placeholder.com/32',
      comment: 'Great post! Thanks for sharing.',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      user: 'Jane Smith',
      avatar: 'https://via.placeholder.com/32',
      comment:
        'This is really interesting. Would love to see more content like this.',
      timestamp: '1 hour ago',
    },
  ])

  const [newComment, setNewComment] = useState('')

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      // Add new comment optimistically
      const comment = {
        id: Date.now(),
        user: 'You',
        avatar: 'https://via.placeholder.com/32',
        comment: newComment,
        timestamp: 'Just now',
      }
      setComments([...comments, comment])
      setNewComment('')

      // TODO: Send to API
      // fetch(`/api/posts/${postId}/comments`, {
      //   method: 'POST',
      //   body: JSON.stringify({ comment: newComment })
      // })
    }
  }

  return (
    <div className='border-t bg-gray-50 rounded-bl-2xl rounded-br-2xl'>
      {/* Comments List */}
      <div className='p-4 max-h-96 overflow-y-auto'>
        {comments.length === 0 ? (
          <p className='text-gray-500 text-center py-4'>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className='space-y-4'>
            {comments.map((comment) => (
              <div key={comment.id} className='flex gap-3'>
                <img
                  src={comment.avatar}
                  alt={comment.user}
                  className='w-8 h-8 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <div className='bg-white rounded-2xl px-4 py-2 shadow-sm'>
                    <p className='font-semibold text-sm text-gray-900'>
                      {comment.user}
                    </p>
                    <p className='text-gray-800 text-sm'>{comment.comment}</p>
                  </div>
                  <div className='flex items-center gap-4 mt-1 px-4'>
                    <button className='text-xs text-gray-500 hover:text-blue-600 font-medium'>
                      Like
                    </button>
                    <button className='text-xs text-gray-500 hover:text-blue-600 font-medium'>
                      Reply
                    </button>
                    <span className='text-xs text-gray-500'>
                      {comment.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className='p-4 border-t border-gray-200'>
        <form onSubmit={handleSubmitComment} className='flex gap-3'>
          <img
            src='https://via.placeholder.com/32'
            alt='Your avatar'
            className='w-8 h-8 rounded-full object-cover'
          />
          <div className='flex-1'>
            <input
              type='text'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Write a comment...'
              className='w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors'
            />
          </div>
          <button
            type='submit'
            disabled={!newComment.trim()}
            className='bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            Post
          </button>
        </form>
      </div>
    </div>
  )
}

export default Comments

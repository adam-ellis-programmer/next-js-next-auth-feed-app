// components/posts/PostsTable.jsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const PostsTable = ({ posts, selectedPosts, onPostSelect, onSelectAll }) => {
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Truncate content for display
  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sort posts
  const sortedPosts = [...posts].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle date sorting
    if (sortField === 'created_at' || sortField === 'updated_at') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Check if all posts are selected
  const allSelected = posts.length > 0 && selectedPosts.length === posts.length

  return (
    <div className='bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-xl'>
      {/* Table Header */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50/80'>
            <tr>
              {/* Select All Checkbox */}
              <th className='px-6 py-4 text-left'>
                <input
                  type='checkbox'
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                />
              </th>

              {/* Image */}
              <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Image
              </th>

              {/* Content */}
              <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Content
              </th>

              {/* Date - Sortable */}
              <th
                className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700'
                onClick={() => handleSort('created_at')}
              >
                <div className='flex items-center gap-1'>
                  Date
                  {sortField === 'created_at' && (
                    <span className='text-blue-600'>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              {/* Likes - Sortable */}
              <th
                className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700'
                onClick={() => handleSort('likes_count')}
              >
                <div className='flex items-center gap-1'>
                  Likes
                  {sortField === 'likes_count' && (
                    <span className='text-blue-600'>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              {/* Comments - Sortable */}
              <th
                className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700'
                onClick={() => handleSort('comments_count')}
              >
                <div className='flex items-center gap-1'>
                  Comments
                  {sortField === 'comments_count' && (
                    <span className='text-blue-600'>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              {/* Actions */}
              <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-200/50'>
            {sortedPosts.map((post) => (
              <tr
                key={post.id}
                className={`hover:bg-white/80 transition-colors ${
                  selectedPosts.includes(post.id) ? 'bg-blue-50/50' : ''
                }`}
              >
                {/* Checkbox */}
                <td className='px-6 py-4'>
                  <input
                    type='checkbox'
                    checked={selectedPosts.includes(post.id)}
                    onChange={(e) => onPostSelect(post.id, e.target.checked)}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                  />
                </td>

                {/* Image */}
                <td className='px-6 py-4'>
                  <div className='w-16 h-16 relative rounded-lg overflow-hidden'>
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt='Post image'
                        fill
                        className='object-cover'
                        sizes='64px'
                      />
                    ) : (
                      <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                        <svg
                          className='w-6 h-6 text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>

                {/* Content */}
                <td className='px-6 py-4'>
                  <div className='max-w-xs'>
                    <p className='text-sm text-gray-900 leading-relaxed'>
                      {truncateContent(post.content)}
                    </p>
                  </div>
                </td>

                {/* Date */}
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-900'>
                    {formatDate(post.created_at)}
                  </div>
                  {post.updated_at !== post.created_at && (
                    <div className='text-xs text-gray-500'>
                      Updated: {formatDate(post.updated_at)}
                    </div>
                  )}
                </td>

                {/* Likes */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-1'>
                    <span className='text-red-500'>❤️</span>
                    <span className='text-sm font-medium text-gray-900'>
                      {post.likes_count || 0}
                    </span>
                  </div>
                </td>

                {/* Comments */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-1'>
                    <span className='text-blue-500'>💬</span>
                    <span className='text-sm font-medium text-gray-900'>
                      {post.comments_count || 0}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/posts/${post.id}`}
                      className='text-green-600 hover:text-green-800 text-sm font-medium'
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className='px-6 py-4 bg-gray-50/80 border-t border-gray-200/50'>
        <div className='flex items-center justify-between text-sm text-gray-600'>
          <span>Showing {posts.length} posts</span>
          <span>{selectedPosts.length} selected</span>
        </div>
      </div>
    </div>
  )
}

export default PostsTable

'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useAlert } from '@/context/AlertContext'
import { useDemoUser } from '@/hooks/demoUser'
import { getPostForEdit, updatePost } from '@/lib/data'

const EditPostPage = ({ params }) => {
  const router = useRouter()
  const { user } = useAuth()
  const { showDemoAlert } = useAlert()
  const { isDemoUser, loading: demoLoading } = useDemoUser()
  const resolvedParams = use(params) // Unwrap the params Promise

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [hasShownDemoAlert, setHasShownDemoAlert] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    image_url: '',
  })

  // Show demo alert once when demo user accesses the page
  useEffect(() => {
    if (!demoLoading && isDemoUser && !hasShownDemoAlert) {
      showDemoAlert()
      setHasShownDemoAlert(true)
    }
  }, [isDemoUser, demoLoading, showDemoAlert, hasShownDemoAlert])

  // Fetch post data - allow for ALL users (demo and regular)
  useEffect(() => {
    const fetchPost = async () => {
      if (!user?.id || !resolvedParams.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const postData = await getPostForEdit(resolvedParams.id, user.id)

        if (!postData) {
          setError('Post not found or you do not have permission to edit it')
          return
        }

        setPost(postData)
        setFormData({
          content: postData.content || '',
          image_url: postData.image_url || '',
        })
      } catch (err) {
        setError(err.message)
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if we're not still checking demo status
    if (!demoLoading) {
      fetchPost()
    }
  }, [user?.id, resolvedParams.id, demoLoading])

  // Handle form submission - block demo users here
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Block demo users from submitting
    if (isDemoUser) {
      showDemoAlert()
      return
    }

    if (!user?.id || !resolvedParams.id) return

    try {
      setSaving(true)
      const result = await updatePost(
        resolvedParams.id,
        {
          content: formData.content.trim(),
          image_url: formData.image_url || null,
        },
        user.id
      )

      if (!result.success) {
        throw new Error(result.error)
      }

      // Redirect to posts page after successful update
      router.push('/posts')
    } catch (err) {
      setError(err.message)
      console.error('Error updating post:', err)
    } finally {
      setSaving(false)
    }
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Please log in
          </h2>
          <p className='text-gray-600'>
            You need to be logged in to edit posts.
          </p>
        </div>
      </div>
    )
  }

  // Show loading while checking demo status OR loading post
  if (demoLoading || loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            {demoLoading ? 'Checking permissions...' : 'Loading post...'}
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => router.back()}
            className='text-blue-600 hover:text-blue-800 text-sm font-medium mb-4'
          >
            ← Back to Posts
          </button>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Edit Post</h1>
          <p className='text-gray-600'>
            {isDemoUser
              ? 'Viewing in demo mode - editing is disabled'
              : 'Make changes to your post'}
          </p>
        </div>

        {/* Demo User Notice */}
        {isDemoUser && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center'>
              <div className='text-yellow-600 text-lg mr-3'>⚠️</div>
              <div>
                <h3 className='text-yellow-800 font-medium'>
                  Demo Mode Active
                </h3>
                <p className='text-yellow-700 text-sm'>
                  You can view this post but cannot make changes. Demo users
                  have read-only access.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Content */}
            <div>
              <label
                htmlFor='content'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Content *
              </label>
              <textarea
                id='content'
                name='content'
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                disabled={isDemoUser}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  isDemoUser ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder='What would you like to share?'
              />
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor='image_url'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Image URL (optional)
              </label>
              <input
                type='url'
                id='image_url'
                name='image_url'
                value={formData.image_url}
                onChange={handleChange}
                disabled={isDemoUser}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isDemoUser ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder='https://example.com/image.jpg'
              />
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Image Preview
                </label>
                <div className='w-full max-w-md h-48 relative rounded-lg overflow-hidden border border-gray-300'>
                  <img
                    src={formData.image_url}
                    alt='Preview'
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex items-center gap-4 pt-6'>
              <button
                type='submit'
                // disabled={saving || !formData.content.trim() || isDemoUser}
                className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                title={isDemoUser ? 'Demo users cannot edit posts' : ''}
              >
                {saving
                  ? 'Saving...'
                  : isDemoUser
                  ? 'Edit Disabled (Demo)'
                  : 'Save Changes'}
              </button>

              <button
                type='button'
                onClick={() => router.back()}
                className='bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors'
              >
                {isDemoUser ? 'Back' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditPostPage

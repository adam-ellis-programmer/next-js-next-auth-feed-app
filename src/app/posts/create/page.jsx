'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const CreatePost = () => {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    content: '',
    image: null,
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleContentChange = (e) => {
    const content = e.target.value
    setFormData((prev) => ({
      ...prev,
      content,
    }))

    // Clear content error when user types
    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: '',
      }))
    }
  }

  const handleImageSelect = (file) => {
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ]
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please select a valid image file (JPG, PNG, GIF, WebP)',
      }))
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        image: 'Image must be less than 5MB',
      }))
      return
    }

    // Clear image error
    setErrors((prev) => ({
      ...prev,
      image: '',
    }))

    // Set image and create preview
    setFormData((prev) => ({
      ...prev,
      image: file,
    }))

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleImageSelect(files[0])
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }))
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Post content is required'
    } else if (formData.content.trim().length > 2000) {
      newErrors.content = 'Post content must be less than 2000 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('content', formData.content.trim())

      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      // Get auth token (you might handle this differently)
      const token = localStorage.getItem('authToken')

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        // Success - redirect to feed or show success message
        router.push('/feed')
      } else {
        setErrors({ submit: data.error || 'Failed to create post' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const characterCount = formData.content.length
  const characterLimit = 2000

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 mt-10'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Create New Post
          </h1>
          <p className='text-gray-600'>
            Share something amazing with the community
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-lg shadow-md p-6 space-y-6'
        >
          {/* Content Text Area */}
          <div>
            <label
              htmlFor='content'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              What's on your mind?
            </label>
            <textarea
              id='content'
              name='content'
              value={formData.content}
              onChange={handleContentChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Share your thoughts, experiences, or anything interesting! 🌟

Use emojis to make your post more engaging 😊
Add hashtags like #photography #nature #life
Ask questions to start conversations 💬'
            />

            {/* Character Count */}
            <div className='flex justify-between items-center mt-2'>
              <div>
                {errors.content && (
                  <p className='text-red-500 text-sm'>{errors.content}</p>
                )}
              </div>
              <p
                className={`text-sm ${
                  characterCount > characterLimit * 0.9
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {characterCount}/{characterLimit}
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Add an Image (Optional)
            </label>

            {!imagePreview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : errors.image
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className='space-y-4'>
                  <div className='text-6xl'>📸</div>
                  <div>
                    <p className='text-lg font-medium text-gray-900 mb-2'>
                      Drop your image here, or{' '}
                      <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        className='text-blue-600 hover:text-blue-700 underline'
                      >
                        browse
                      </button>
                    </p>
                    <p className='text-sm text-gray-600'>
                      Supports JPG, PNG, GIF, WebP up to 5MB
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleFileInput}
                  className='hidden'
                />
              </div>
            ) : (
              <div className='relative'>
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='w-full h-64 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={removeImage}
                  className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors'
                >
                  ✕
                </button>
                <div className='absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm'>
                  {formData.image?.name}
                </div>
              </div>
            )}

            {errors.image && (
              <p className='text-red-500 text-sm mt-2'>{errors.image}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className='bg-red-50 border border-red-200 rounded-md p-3'>
              <p className='text-red-700 text-sm'>{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex items-center justify-between pt-4 border-t'>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors'
            >
              Cancel
            </button>

            <div className='flex space-x-3'>
              <button
                type='button'
                onClick={() => {
                  setFormData({ content: '', image: null })
                  setImagePreview(null)
                  setErrors({})
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors'
              >
                Clear
              </button>

              <button
                type='submit'
                disabled={
                  isLoading || (!formData.content.trim() && !formData.image)
                }
                className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                  isLoading || (!formData.content.trim() && !formData.image)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <span className='flex items-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips */}
        <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-blue-800 mb-2'>
            📝 Tips for Great Posts
          </h3>
          <ul className='text-sm text-blue-700 space-y-1'>
            <li>• Use emojis to make your content more engaging 😊</li>
            <li>• Add relevant hashtags to reach more people</li>
            <li>• Ask questions to encourage comments and discussions</li>
            <li>• Share personal experiences or insights</li>
            <li>• High-quality images get more engagement</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CreatePost

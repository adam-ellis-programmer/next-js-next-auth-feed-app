'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
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
    setErrors({}) // Clear any previous errors

    try {
      // API call to authenticate user
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: rememberMe,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success - store token and redirect
        if (data.token) {
          // Store JWT token (you might use a different approach)
          localStorage.setItem('authToken', data.token)
        }

        // Redirect to dashboard/feed
        window.location.href = '/feed'
        // Or use router: router.push('/feed')
      } else {
        // Handle API errors
        if (response.status === 401) {
          setErrors({ submit: 'Invalid email or password' })
        } else {
          setErrors({ submit: data.error || 'Login failed. Please try again.' })
        }
      }
    } catch (error) {
      setErrors({
        submit: 'Network error. Please check your connection and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    // Handle forgot password logic
    alert('Forgot password functionality would be implemented here')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 mt-10'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome back
          </h2>
          <p className='text-gray-600'>Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-white p-8 rounded-lg shadow-md space-y-6'
        >
          {/* Email */}
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='john@example.com'
              autoComplete='email'
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='••••••••'
                autoComplete='current-password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-2 text-gray-500 hover:text-gray-700'
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='rememberMe'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label
                htmlFor='rememberMe'
                className='ml-2 block text-sm text-gray-700'
              >
                Remember me
              </label>
            </div>

            <button
              type='button'
              onClick={handleForgotPassword}
              className='text-sm text-blue-600 hover:text-blue-700 font-medium'
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className='bg-red-50 border border-red-200 rounded-md p-3'>
              <p className='text-red-700 text-sm'>{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <span className='flex items-center justify-center'>
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
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Sign Up Link */}
          <div className='text-center pt-4'>
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <Link
                href='/auth/sign-up'
                className='text-blue-600 hover:text-blue-700 font-medium'
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>

        {/* Social Login Options */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className='relative mb-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <button
              onClick={() => alert('Google login would be implemented here')}
              className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'
            >
              <span className='mr-2'>🔍</span>
              Google
            </button>
            <button
              onClick={() => alert('Facebook login would be implemented here')}
              className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'
            >
              <span className='mr-2'>📘</span>
              Facebook
            </button>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
          <h3 className='text-sm font-medium text-blue-800 mb-2'>
            Demo Accounts
          </h3>
          <div className='text-xs text-blue-700 space-y-1'>
            <p>
              <strong>User:</strong> demo@example.com / password123
            </p>
            <p>
              <strong>Admin:</strong> admin@example.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

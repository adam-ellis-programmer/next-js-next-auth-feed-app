'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    // prettier-ignore
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    // prettier-ignore
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      // API call to create user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success - redirect or show success message
        alert(
          'Account created successfully! Please check your email to verify.'
        )
        // Redirect to login or dashboard
        // router.push('/login')
      } else {
        // Handle API errors
        setErrors({ submit: data.error || 'Failed to create account' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Create your account
          </h2>
          <p className='text-gray-600'>
            Join thousands of users sharing amazing content
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-white p-8 rounded-lg shadow-md space-y-6'
        >
          {/* Name Fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='firstName'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                First Name
              </label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='John'
              />
              {errors.firstName && (
                <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='lastName'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Last Name
              </label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='Doe'
              />
              {errors.lastName && (
                <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>
              )}
            </div>
          </div>

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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='••••••••'
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.confirmPassword}
              </p>
            )}
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className='text-center pt-4'>
            <p className='text-gray-600'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-blue-600 hover:text-blue-700 font-medium'
              >
                Sign in here
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
            <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              <span className='mr-2'>🔍</span>
              Google
            </button>
            <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              <span className='mr-2'>📘</span>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp

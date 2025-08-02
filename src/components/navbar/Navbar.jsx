import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='h-[100px] shadow-2xl flex items-center justify-between px-6 relative z-40'>
      {/* Logo/Brand */}
      <div>
        <Link
          href='/'
          className='text-2xl font-bold text-blue-600 hover:text-blue-800'
        >
          Flutter Social
        </Link>
      </div>

      {/* Navigation Links */}
      <div className='flex space-x-6'>
        <Link
          href='/'
          className='text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer'
        >
          Home
        </Link>

        <Link
          href='/auth/dashboard'
          className='text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer'
        >
          Dash
        </Link>
        <Link
          href='/posts'
          className='text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer'
        >
          Posts
        </Link>
        <Link
          href='/feed'
          className='text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer '
        >
          Feed
        </Link>
        <Link
          href='/posts/create'
          className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer'
        >
          Create Post
        </Link>
      </div>
    </div>
  )
}

export default Navbar

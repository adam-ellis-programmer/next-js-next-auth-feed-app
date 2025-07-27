// src/app/page.js
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold text-center mb-8'>
        Welcome to Feed App
      </h1>

      <div className='text-center'>
        <p className='text-lg text-gray-600 mb-8'>
          Discover infinite content with smart ad integration
        </p>

        <div className='space-x-4'>
          <Link
            className='bg-blue-500 text-2xl text-white p-3 rounded cursor-pointer'
            href={'/auth/sign-in'}
          >
            sign in
          </Link>
          <Link
            className='bg-blue-500 text-2xl text-white p-3 rounded cursor-pointer'
            href={'/auth/sign-up'}
          >
            sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

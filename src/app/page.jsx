// src/app/page.js
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-4xl mx-auto'>
          {/* Main Headline */}
          <h1 className='text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight'>
            Your Feed,
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
              {' '}
              Reimagined
            </span>
          </h1>

          {/* Subtitle */}
          <p className='text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto'>
            Discover infinite content with intelligent curation and seamless ad
            integration. Join thousands creating their perfect feed experience.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16'>
            <Link
              href='/auth/sign-up'
              className='group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25'
            >
              <span className='relative z-10'>Get Started Free</span>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </Link>

            <Link
              href='/auth/sign-in'
              className='group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className='grid md:grid-cols-3 gap-8 mb-20'>
          <div className='group text-center p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              Lightning Fast
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Experience blazing-fast content loading with our optimized feed
              technology. No more waiting, just pure engagement.
            </p>
          </div>

          <div className='group text-center p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300'>
            <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              Smart Curation
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              AI-powered algorithms learn your preferences to deliver exactly
              the content you want to see, when you want to see it.
            </p>
          </div>

          <div className='group text-center p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300'>
            <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              Active Community
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Connect with creators and discover communities that share your
              interests. Engage, create, and grow together.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className='text-center bg-white/40 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            Trusted by Creators Worldwide
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60'>
            {/* Placeholder for company logos or stats */}
            <div className='text-center'>
              <div className='text-4xl font-black text-blue-600 mb-2'>10K+</div>
              <div className='text-gray-600 font-medium'>Active Users</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-black text-purple-600 mb-2'>
                50M+
              </div>
              <div className='text-gray-600 font-medium'>Posts Shared</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-black text-green-600 mb-2'>
                99.9%
              </div>
              <div className='text-gray-600 font-medium'>Uptime</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-black text-orange-600 mb-2'>
                24/7
              </div>
              <div className='text-gray-600 font-medium'>Support</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className='text-center mt-20'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Ready to Transform Your Feed?
          </h2>
          <p className='text-xl text-gray-600 mb-8'>
            Join thousands of users already creating their perfect content
            experience.
          </p>
          <Link
            href='/auth/sign-up'
            className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25'
          >
            Start Your Journey
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className='absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
      <div className='absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000'></div>
    </div>
  )
}

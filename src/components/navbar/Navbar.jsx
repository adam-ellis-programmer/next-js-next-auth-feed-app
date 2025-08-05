'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { links } from '@/lib/links'
import { RxHamburgerMenu } from 'react-icons/rx'
import MobileNav from './MobileNav'

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  // nav logic
  const onMobileClick = () => {
    setIsNavOpen(() => !isNavOpen)
  }
  return (
    <nav className='h-[100px] shadow-2xl  relative z-40'>
      <div className='max-w-[1400px] mx-auto  flex justify-between items-center h-full'>
        {/* Logo/Brand */}
        <div>
          <Link
            href='/'
            className='text-2xl font-bold text-blue-600 hover:text-blue-800'
          >
            Next Social
          </Link>
        </div>

        {/* Navigation Links */}
        <div className='flex space-x-6 '>
          <div className=' space-x-6 hidden md:flex'>
            {links.map((item, i) => {
              return (
                <Link
                  key={i}
                  href={item.link}
                  className='text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer'
                >
                  {item.text}
                </Link>
              )
            })}
          </div>

          <button
            onClick={onMobileClick}
            className='bg-gradient-to-r from-blue-600 to-purple-600 w-25  justify-center items-center rounded cursor-pointer flex md:hidden'
          >
            <RxHamburgerMenu className='text-3xl text-white' />
          </button>

          <Link
            href='/posts/create'
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer'
          >
            Create Post
          </Link>
        </div>
      </div>
      {isNavOpen && <MobileNav />}
    </nav>
  )
}

export default Navbar

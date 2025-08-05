import { links } from '@/lib/links'
import Link from 'next/link'
import React from 'react'

const MobileNav = ({ setIsNavOpen }) => {
  return (
    <div className='bg-white h-screen'>
      {/* inner container */}
      <ul>
        {links.map((item, i) => {
          return (
            <li onClick={() => setIsNavOpen(false)} key={i} className='mb-3'>
              <Link href={item.link} className=' block text-2xl p-4'>
                {item.text}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MobileNav

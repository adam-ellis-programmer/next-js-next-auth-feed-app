// src/lib/fonts.js (Create a shared fonts file)
import { Exo_2, Inter, Roboto, Poppins } from 'next/font/google'

export const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-exo2',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

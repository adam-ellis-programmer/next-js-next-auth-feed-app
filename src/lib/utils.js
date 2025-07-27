import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

// class names function
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

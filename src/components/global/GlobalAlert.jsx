'use client'
import { useAlert } from '@/context/AlertContext'
import { IoMdWarning } from 'react-icons/io'
const GlobalAlert = () => {
  const { alert, hideAlert } = useAlert()

  // if false return null
  if (!alert.show) return null

  const getAlertStyles = () => {
    const baseStyles =
      'min-h-20 p-5 text-white capitalize text-2xl fixed top-0 z-[100] w-full transition-all duration-300 ease-in-out'

    switch (alert.type) {
      case 'error':
        return `${baseStyles} bg-[#f87171]`
      case 'success':
        return `${baseStyles} bg-green-500`
      case 'warning':
        return `${baseStyles} bg-yellow-500`
      case 'info':
        return `${baseStyles} bg-blue-500`
      default:
        return `${baseStyles} bg-[#f87171]`
    }
  }

  return (
    <div className={getAlertStyles()}>
      <div className='flex justify-between items-center max-w-[1400px] mx-auto'>
        <IoMdWarning />
        <span>{alert.message}</span>
        <button
          onClick={hideAlert}
          className='text-white hover:text-gray-200 text-3xl leading-none cursor-pointer'
          aria-label='Close alert'
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default GlobalAlert

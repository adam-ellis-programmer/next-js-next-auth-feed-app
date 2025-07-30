// components/common/LazyImage.jsx
'use client'
import { useState, useRef, useEffect, useMemo } from 'react'

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = null,
  onLoad = null,
  onView = null, // Callback for when image comes into view (for analytics)
  threshold = 0.1,
  rootMargin = '50px',
  root = null,
  rootSelector = null, // CSS selector for root element (e.g., '#feed-container')
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  const imgRef = useRef()

  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(
    () => ({
      threshold,
      rootMargin,
      root, // This will be set in the effect if rootSelector is provided
    }),
    [threshold, rootMargin, root]
  )

  useEffect(() => {
    // Determine the root element
    let rootElement = root
    if (rootSelector && !root) {
      rootElement = document.querySelector(rootSelector)
    }

    const observerOptions = {
      ...options,
      root: rootElement,
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)

        // Track view for analytics (only once per image)
        if (!hasBeenViewed && onView) {
          setHasBeenViewed(true)
          onView({ src, alt })
        }

        observer.disconnect()
      }
    }, observerOptions)

    // Start observing the element
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    // Cleanup function
    return () => {
      observer.disconnect()
    }
  }, [options, hasBeenViewed, onView, src, alt, root, rootSelector])

  const handleImageLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  const handleImageError = () => {
    setHasError(true)
    console.warn(`Failed to load image: ${src}`)
  }

  // Default placeholder
  const defaultPlaceholder = (
    <div className='bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center h-full'>
      <svg
        className='w-8 h-8 text-gray-400'
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path
          fillRule='evenodd'
          d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
          clipRule='evenodd'
        />
      </svg>
    </div>
  )

  return (
    <div ref={imgRef} className={`lazy-image-container relative ${className}`}>
      {/* Show placeholder while not in view or loading */}
      {(!isInView || !isLoaded) && !hasError && (
        <div className={`lazy-placeholder absolute inset-0 ${className}`}>
          {placeholder || defaultPlaceholder}
        </div>
      )}

      {/* Load actual image when in view */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500 ease-in-out`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading='lazy' // Native lazy loading as fallback
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className={`lazy-error ${className} bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-center p-4`}
        >
          <div>
            <svg
              className='w-8 h-8 text-gray-400 mx-auto mb-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <span className='text-gray-500 text-sm'>Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default LazyImage

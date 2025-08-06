// components/pagination/MyPostsPagination.jsx
'use client'

const MyPostsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
  showPages = 7, // Number of page buttons to show
}) => {
  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = []
    const halfRange = Math.floor(showPages / 2)

    let startPage = Math.max(1, currentPage - halfRange)
    let endPage = Math.min(totalPages, currentPage + halfRange)

    // Adjust if we're near the beginning
    if (currentPage <= halfRange) {
      endPage = Math.min(totalPages, showPages)
    }

    // Adjust if we're near the end
    if (currentPage + halfRange >= totalPages) {
      startPage = Math.max(1, totalPages - showPages + 1)
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()

  const handlePageClick = (page) => {
    if (
      page !== '...' &&
      page !== currentPage &&
      page >= 1 &&
      page <= totalPages
    ) {
      onPageChange(page)
    }
  }

  const handlePrevious = () => {
    if (hasPrev) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      onPageChange(currentPage + 1)
    }
  }

  const handleFirst = () => {
    if (currentPage !== 1) {
      onPageChange(1)
    }
  }

  const handleLast = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages)
    }
  }

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className='flex items-center justify-center space-x-2'>
      {/* First Page Button */}
      <button
        onClick={handleFirst}
        disabled={currentPage === 1}
        className='px-3 py-2 text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-white/80 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
        title='First page'
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
          />
        </svg>
      </button>

      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={!hasPrev}
        className='px-3 py-2 text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-white/80 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
        title='Previous page'
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M15 19l-7-7 7-7'
          />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className='flex items-center space-x-1'>
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={page === '...' || page === currentPage}
            className={`
              px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${
                page === currentPage
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : page === '...'
                  ? 'text-gray-400 cursor-default bg-transparent'
                  : 'text-gray-600 bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:text-blue-600 hover:border-blue-300'
              }
            `}
            title={page === '...' ? '' : `Go to page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!hasNext}
        className='px-3 py-2 text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-white/80 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
        title='Next page'
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 5l7 7-7 7'
          />
        </svg>
      </button>

      {/* Last Page Button */}
      <button
        onClick={handleLast}
        disabled={currentPage === totalPages}
        className='px-3 py-2 text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-white/80 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
        title='Last page'
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 5l7 7-7 7M5 5l7 7-7 7'
          />
        </svg>
      </button>

      {/* Page Info */}
      <div className='ml-4 text-sm text-gray-600 bg-white/40 backdrop-blur-sm px-3 py-2 rounded-lg'>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

export default MyPostsPagination

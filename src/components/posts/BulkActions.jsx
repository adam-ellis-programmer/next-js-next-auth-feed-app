// components/posts/BulkActions.jsx
'use client'
import { useState } from 'react'

const BulkActions = ({ selectedCount, onDelete, onUpdate, loading }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete()
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
    }
  }

  const handleUpdate = (updates) => {
    onUpdate(updates)
    setShowUpdateModal(false)
  }

  return (
    <>
      <div className='bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-4 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
              {selectedCount}
            </div>
            <span className='text-gray-900 font-medium'>
              {selectedCount} post{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className='flex items-center gap-3'>
            {/* Update Button */}
            <button
              onClick={() => setShowUpdateModal(true)}
              disabled={loading}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
            >
              {loading ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              ) : (
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
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              )}
              Update
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                showDeleteConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
              ) : (
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
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              )}
              {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
            </button>

            {/* Cancel Delete */}
            {showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='text-gray-600 hover:text-gray-800 px-3 py-2 text-sm'
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Delete Warning */}
        {showDeleteConfirm && (
          <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-800 text-sm'>
              ⚠️ This action cannot be undone. Are you sure you want to delete{' '}
              {selectedCount} post{selectedCount !== 1 ? 's' : ''}?
            </p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full'>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>
              Update {selectedCount} Post{selectedCount !== 1 ? 's' : ''}
            </h3>

            <div className='space-y-4'>
              {/* Visibility Update */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Visibility Status
                </label>
                <div className='space-y-2'>
                  <button
                    onClick={() => handleUpdate({ is_public: true })}
                    className='w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='font-medium text-gray-900'>Make Public</div>
                    <div className='text-sm text-gray-600'>
                      Visible to everyone
                    </div>
                  </button>
                  <button
                    onClick={() => handleUpdate({ is_public: false })}
                    className='w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='font-medium text-gray-900'>
                      Make Private
                    </div>
                    <div className='text-sm text-gray-600'>
                      Only visible to you
                    </div>
                  </button>
                </div>
              </div>

              {/* Archive Update */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Archive Status
                </label>
                <div className='space-y-2'>
                  <button
                    onClick={() => handleUpdate({ is_archived: true })}
                    className='w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='font-medium text-gray-900'>
                      Archive Posts
                    </div>
                    <div className='text-sm text-gray-600'>
                      Hide from main feed
                    </div>
                  </button>
                  <button
                    onClick={() => handleUpdate({ is_archived: false })}
                    className='w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='font-medium text-gray-900'>
                      Unarchive Posts
                    </div>
                    <div className='text-sm text-gray-600'>
                      Show in main feed
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 mt-6'>
              <button
                onClick={() => setShowUpdateModal(false)}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BulkActions

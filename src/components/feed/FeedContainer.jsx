// components/feed/FeedContainer.jsx
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { PostCard } from '@/components/posts/PostCard'

const FeedContainer = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1) // Track current page for pagination
  const observerRef = useRef()
  const loadingRef = useRef()

  // Fetch more posts function
  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const response = await fetch(`/api/posts?offset=${page * 20}&limit=20`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      
      const newPosts = await response.json()
      
      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts(prev => [...prev, ...newPosts])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error fetching more posts:', error)
      // Optionally show error state
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          fetchMorePosts()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    observerRef.current = observer

    return () => {
      observer.disconnect()
    }
  }, [fetchMorePosts, hasMore, loading])

  return (
    <div
      className='h-[600px] overflow-y-auto space-y-4 p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-gray-200/50'
      id='feed-container'
    >
      {posts.map((post, index) => (
        <div
          key={post.id}
          className='group transform transition-all duration-300 hover:scale-[1.02] animate-fade-in-up'
        >
          <PostCard post={post} />
        </div>
      ))}

      {/* Loading trigger and indicator */}
      <div 
        ref={loadingRef} 
        className='text-center py-8'
      >
        {loading && (
          <div className='bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-700 px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2'>
            <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            Loading more posts...
          </div>
        )}
        
        {!hasMore && !loading && posts.length > 0 && (
          <div className='bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-700 px-8 py-3 rounded-full font-semibold inline-block'>
            You've reached the end! 🎉
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedContainer
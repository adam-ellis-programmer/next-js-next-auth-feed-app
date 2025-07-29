// app/feed/page.jsx
import { PostCard } from '@/components/posts/PostCard'
import { getPosts } from '@/lib/data'

// Make it an async Server Component
export default async function Feed() {
  // Fetch real data from Supabase
  const posts = await getPosts()
  console.log(posts)

  // Handle empty state
  if (!posts.length) {
    return (
      <div className='grid h-screen max-w-[500px] mx-auto mt-10'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <p className='text-gray-600 text-lg mb-4'>No posts yet!</p>
            <p className='text-gray-500'>
              Be the first to share something amazing.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='grid h-screen max-w-[500px] mx-auto mt-10'>
      <div className=''>
        {posts.length}
        <div className='h-140 overflow-scroll space-y-4 p-4'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

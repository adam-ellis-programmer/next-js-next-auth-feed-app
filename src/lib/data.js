// lib/data.js
import { cache } from 'react'
import { supabase } from '@/utils/supabase'

// Updated getPosts function with pagination support
// lib/data.js
// This should be much faster with your existing indexes
// lib/data.js - Go back to the original approach (now that RLS is disabled)

// *************
// const userIds = [...new Set(posts.map((p) => p.user_id).filter(Boolean))]
// Removes null, undefined, empty string, 0, false values
// *************

export const getPosts = cache(async (offset = 0, limit = 20) => {
  const startTime = Date.now()
  console.log(`🔍 Starting getPosts query (offset: ${offset}, limit: ${limit})`)

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        author:user_id (
          id,
          username,
          full_name,
          avatar_url,
          first_name,
          last_name,
          email
        )
      `
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const endTime = Date.now()
    console.log(`✅ getPosts completed in ${endTime - startTime}ms`)
    console.log(`📊 Returned ${posts?.length || 0} posts`)

    if (error) throw error
    return posts || []
  } catch (error) {
    const endTime = Date.now()
    console.log(`❌ getPosts failed in ${endTime - startTime}ms`)
    console.error('Error fetching posts:', error)
    return []
  }
})

// Get total count of posts (for stats and pagination info)
export const getPostsCount = cache(async () => {
  try {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error fetching posts count:', error)
    return 0
  }
})

// Get posts with view tracking (for analytics)
export const trackPostView = async (postId, userId = null) => {
  try {
    // You can implement view tracking here
    // For example, insert into a post_views table
    const { error } = await supabase.from('post_views').insert({
      post_id: postId,
      user_id: userId,
      viewed_at: new Date().toISOString(),
    })

    if (error && error.code !== '23505') {
      // Ignore duplicate key errors
      console.error('Error tracking post view:', error)
    }
  } catch (error) {
    console.error('Error tracking post view:', error)
  }
}

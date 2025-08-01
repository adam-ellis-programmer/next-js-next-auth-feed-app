// lib/data.js
import { cache } from 'react'
import { supabase } from '@/utils/supabase'
// *************
// const userIds = [...new Set(posts.map((p) => p.user_id).filter(Boolean))]
// Removes null, undefined, empty string, 0, false values
// *************

// Updated getPosts function with pagination support
// lib/data.js
// This should be much faster with your existing indexes
// lib/data.js - Go back to the original approach (now that RLS is disabled)

// offset is start index
export const getPosts = cache(async (offset = 0, limit = 20) => {
  const startTime = Date.now()
  console.log(`🔍 Starting getPosts query (offset: ${offset}, limit: ${limit})`)
  const end = offset + limit - 1 // Ending position (inclusive)
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
      .range(offset, end)

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

// ===================================================
// USER POSTS PAGE
// ===================================================

// lib/data.js - Add these functions to your existing data.js file

// Get posts for a specific user with pagination
export const getUserPosts = cache(async (userId, page = 1, limit = 10) => {
  const startTime = Date.now()
  const offset = (page - 1) * limit
  // Page 1: offset = (1-1) * 10 = 0  → Start at position 0
  // Page 2: offset = (2-1) * 10 = 10 → Start at position 10
  // Page 3: offset = (3-1) * 10 = 20 → Start at position 20
  const start = offset // Ending position (inclusive)
  const end = offset + limit - 1

  console.log(
    `🔍 Starting getUserPosts query (userId: ${userId}, page: ${page}, limit: ${limit})`
  )

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
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, end)

    const endTime = Date.now()
    console.log(`✅ getUserPosts completed in ${endTime - startTime}ms`)
    console.log(`📊 Returned ${posts?.length || 0} posts for user ${userId}`)

    if (error) throw error
    return posts || []
  } catch (error) {
    const endTime = Date.now()
    console.log(`❌ getUserPosts failed in ${endTime - startTime}ms`)
    console.error('Error fetching user posts:', error)
    return []
  }
})

// Get total count of posts for a specific user
export const getUserPostsCount = cache(async (userId) => {
  try {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error fetching user posts count:', error)
    return 0
  }
})

// Bulk delete posts
export const bulkDeletePosts = async (postIds, userId) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      //  Find all posts where the id field matches ANY value in the postIds array
      .in('id', postIds) // WHERE id is IN this array of IDs
      // SQL equivalent: AND user_id = 'current-user-id'
      .eq('user_id', userId) // equal: ---> Security: only delete user's own posts

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error bulk deleting posts:', error)
    return { success: false, error: error.message }
  }
}

// Bulk update posts (e.g., for privacy settings, categories, etc.)
export const bulkUpdatePosts = async (postIds, updates, userId) => {
  try {
    const { error } = await supabase
      .from('posts')
      .update(updates)
      .in('id', postIds)
      .eq('user_id', userId) // Security: only update user's own posts

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error bulk updating posts:', error)
    return { success: false, error: error.message }
  }
}

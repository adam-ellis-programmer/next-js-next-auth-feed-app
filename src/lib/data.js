// lib/data.js
import { cache } from 'react'
import { supabase } from '@/utils/supabase'
// lib/data.js - After updating foreign key
export const getPosts = cache(async () => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      // create a new object and populate that with
      // the data from table assosiated with the referenced table
      // assosiated with that id
      // user_id field has a relationship with the users table
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
    if (error) throw error
    return posts || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
})

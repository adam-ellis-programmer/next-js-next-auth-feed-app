// src/seed/seedPostsServiceRole.js
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { samplePosts } from './postData.js'

// Load environment variables from both .env and .env.local
dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local' })

// Use SERVICE ROLE key for seeding (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Add this to .env.local

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('  - SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  console.log('💡 Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file')
  process.exit(1)
}

// Create Supabase client with SERVICE ROLE key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getRandomUser() {
  try {
    const { data: users, error } = await supabase.from('users').select('id')

    if (error) throw error

    if (!users || users.length === 0) {
      console.log(
        '❌ No users found. Please ensure you have users in your database first.'
      )
      return null
    }

    const randomIndex = Math.floor(Math.random() * users.length)
    return users[randomIndex].id
  } catch (error) {
    console.error('Error fetching users:', error)
    return null
  }
}

async function seedPosts() {
  try {
    console.log('🌱 Starting to seed posts (using service role key)...')

    // Check if we have any users first
    const { data: existingUsers, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (userError) throw userError

    if (!existingUsers || existingUsers.length === 0) {
      console.log(
        '❌ No users found in database. Please create some users first.'
      )
      return
    }

    // Check if posts already exist and clear them
    const { data: existingPosts, error: postsError } = await supabase
      .from('posts')
      .select('id')
      .limit(1)

    if (postsError) throw postsError

    if (existingPosts && existingPosts.length > 0) {
      console.log('🧹 Existing posts found - clearing database first...')
      await clearPosts()
      console.log('✅ Database cleared, proceeding with fresh seed...')
    }

    const postsToInsert = []

    // Prepare posts with random user assignments
    for (const post of samplePosts) {
      const userId = await getRandomUser()
      if (userId) {
        postsToInsert.push({
          ...post,
          user_id: userId,
          likes_count: Math.floor(Math.random() * 50),
          comments_count: Math.floor(Math.random() * 20),
          created_at: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
      }
    }

    if (postsToInsert.length === 0) {
      console.log('❌ No posts to insert - no valid users found.')
      return
    }

    console.log('📝 Bypassing RLS with service role key...')

    // Insert posts (RLS is automatically bypassed with service role key)
    const { data, error } = await supabase
      .from('posts')
      .insert(postsToInsert)
      .select()

    if (error) throw error

    console.log(`✅ Successfully seeded ${postsToInsert.length} posts!`)
    console.log('📊 Posts created with:')
    console.log(`   - Random user assignments`)
    console.log(`   - Realistic content and images`)
    console.log(`   - Random likes and comments counts`)
    console.log(`   - Timestamps from the past week`)

    return data
  } catch (error) {
    console.error('❌ Error seeding posts:', error.message)
    throw error
  }
}

async function clearPosts() {
  try {
    console.log('🧹 Clearing existing posts (using service role key)...')

    // Delete all posts (using date filter - cleaner than fake UUID)
    const { error } = await supabase
      .from('posts')
      .delete()
      .gt('created_at', '1900-01-01') // Delete all posts created after 1900 (i.e., all posts)

    if (error) throw error

    console.log('✅ All posts cleared successfully!')
  } catch (error) {
    console.error('❌ Error clearing posts:', error.message)
    throw error
  }
}

// Export functions for use
export { seedPosts, clearPosts }

// REMOVED: The automatic execution that was causing double seeding
// The index.js file will handle the command parsing and execution

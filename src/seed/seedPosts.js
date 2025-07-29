// src/seed/seedPostsServiceRole.js
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

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

const samplePosts = [
  {
    content:
      "Just finished building my first React component library! 🚀 The feeling when everything clicks into place is incredible. Can't wait to share it with the community! #coding #react #opensource",
    image_url:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      'Beautiful sunset from my morning hike today. Sometimes you need to step away from the screen and reconnect with nature 🌅 #hiking #nature #mentalhealth',
    image_url:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      "Coffee shop vibes today ☕️ Working on a new project and the energy here is perfect for productivity. What's your favorite workspace? #remote #productivity #coffee",
    image_url:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      "Finally deployed my side project to production! 🎉 It's a simple task manager, but I'm proud of the clean UI and smooth animations. Link in bio! #webdev #deployment #sideproject",
    image_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      'Weekend cooking experiment: homemade pasta from scratch! 🍝 Turns out coding and cooking have a lot in common - both require patience, precision, and creativity.',
    image_url:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      'Team meeting success! 🤝 Love working with passionate people who care about building great products. Collaboration is where the magic happens. #teamwork #startup #tech',
    image_url:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      "Reading 'Clean Code' again and picking up new insights every time 📚 Some books never get old. What's your go-to tech book for inspiration? #reading #cleancode #learning",
    image_url:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      'Late night coding session fueled by determination ⚡️ Working on optimizing database queries and seeing 50% performance improvements. The grind pays off! #performance #database #latenight',
    image_url:
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      'Attended an amazing tech conference today! 🎤 So many brilliant minds sharing innovative ideas. Feeling inspired and ready to implement some new techniques. #conference #networking #innovation',
    image_url:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
  {
    content:
      'Success! Just merged my first major feature to the main branch 🎯 Six weeks of work, countless commits, and thorough testing. Ready for production! #git #deployment #milestone',
    image_url:
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop&auto=format',
    image_path: null,
    image_bucket: 'post-images',
  },
]

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

    const { error } = await supabase
      .from('posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw error

    console.log('✅ All posts cleared successfully!')
  } catch (error) {
    console.error('❌ Error clearing posts:', error.message)
    throw error
  }
}

// Export functions for use
export { seedPosts, clearPosts }

// Run the seeder
const command = process.argv[2]

console.log('🚀 Seeder started with command:', command)
console.log('📋 Available commands: posts, clear, reset')

switch (command) {
  case 'posts':
    console.log('📝 Running seedPosts...')
    seedPosts()
      .then(() => {
        console.log('🎉 Seeding completed!')
        process.exit(0)
      })
      .catch((error) => {
        console.error('💥 Seeding failed:', error)
        process.exit(1)
      })
    break

  case 'clear':
    console.log('🧹 Running clearPosts...')
    clearPosts()
      .then(() => {
        console.log('🎉 Clearing completed!')
        process.exit(0)
      })
      .catch((error) => {
        console.error('💥 Clearing failed:', error)
        process.exit(1)
      })
    break

  case 'reset':
    console.log('🔄 Running reset (clear + seed)...')
    clearPosts()
      .then(() => seedPosts())
      .then(() => {
        console.log('🎉 Reset completed!')
        process.exit(0)
      })
      .catch((error) => {
        console.error('💥 Reset failed:', error)
        process.exit(1)
      })
    break

  default:
    console.log('❓ No valid command provided')
    console.log('🌱 Database Seeder')
    console.log('')
    console.log('Available commands:')
    console.log('  npm run seed:posts  - Add sample posts')
    console.log('  npm run seed:clear  - Clear all posts')
    console.log('  npm run seed:reset  - Clear and re-seed posts')
    console.log('')
    process.exit(0)
}

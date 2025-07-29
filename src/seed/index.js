// src/seed/index.js
import dotenv from 'dotenv'
import { seedPosts, clearPosts } from './seedPostsServiceRole.js'

// Load environment variables from .env.local (Next.js convention)
dotenv.config({ path: '.env.local' })

async function main() {
  const command = process.argv[2]
  
  try {
    switch (command) {
      case 'posts':
        await seedPosts()
        break
      case 'clear':
        await clearPosts()
        break
      case 'reset':
        await clearPosts()
        await seedPosts()
        break
      default:
        console.log('🌱 Database Seeder')
        console.log('')
        console.log('Available commands:')
        console.log('  npm run seed:posts  - Add sample posts')
        console.log('  npm run seed:clear  - Clear all posts') 
        console.log('  npm run seed:reset  - Clear and re-seed posts')
        console.log('')
    }
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

main()
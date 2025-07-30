// app/api/posts/route.js
import { NextResponse } from 'next/server'
import { getPosts } from '@/lib/data'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Validate parameters
    if (offset < 0 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    const posts = await getPosts(offset, limit)

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error in posts API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

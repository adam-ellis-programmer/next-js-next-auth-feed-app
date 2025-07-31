// app/api/posts/user/route.js - CORRECT CODE
import { NextResponse } from 'next/server'
import { getUserPosts, getUserPostsCount } from '@/lib/data'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')

    console.log('User posts API called:', { userId, page, limit })

    // Validate parameters
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    // Get posts and total count in parallel
    const [posts, totalCount] = await Promise.all([
      getUserPosts(userId, page, limit),
      getUserPostsCount(userId),
    ])

    console.log('User posts fetched:', { postsCount: posts.length, totalCount })

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    })
  } catch (error) {
    console.error('Error in user posts API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user posts', details: error.message },
      { status: 500 }
    )
  }
}

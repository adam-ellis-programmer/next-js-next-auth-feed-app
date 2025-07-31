// app/api/posts/bulk/route.js - CREATE THIS NEW FILE
import { NextResponse } from 'next/server'
import { bulkDeletePosts, bulkUpdatePosts } from '@/lib/data'

export async function DELETE(request) {
  try {
    const { postIds, userId } = await request.json()

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Post IDs array is required' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const result = await bulkDeletePosts(postIds, userId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      deletedCount: postIds.length,
    })
  } catch (error) {
    console.error('Error in bulk delete API:', error)
    return NextResponse.json(
      { error: 'Failed to delete posts' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const { postIds, updates, userId } = await request.json()

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Post IDs array is required' },
        { status: 400 }
      )
    }

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'User ID and updates are required' },
        { status: 400 }
      )
    }

    const result = await bulkUpdatePosts(postIds, updates, userId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      updatedCount: postIds.length,
    })
  } catch (error) {
    console.error('Error in bulk update API:', error)
    return NextResponse.json(
      { error: 'Failed to update posts' },
      { status: 500 }
    )
  }
}

// app/api/posts/bulk/route.js - Enhanced version with validation
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
    // console.log('UPDATES---->', updates)
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
    //  **** SAFTEY CHECKS ****

    // Optional: Validate allowed update fields
    const allowedFields = ['is_public', 'is_archived']

    // updateKeys
    const updateKeys = Object.keys(updates)

    // Take out any fields that are NOT valid -- then check if array is > 0
    // prettier-ignore
    const invalidFields = updateKeys.filter((key) => !allowedFields.includes(key))

    // console.log('==invalidFields==', invalidFields)
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid update fields: ${invalidFields.join(', ')}` },
        { status: 400 }
      )
    }

    // **** CHECK THAT IT IS BOOLEAN ****
    // Optional: Validate field types
    if (
      updates.hasOwnProperty('is_public') &&
      typeof updates.is_public !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'is_public must be a boolean' },
        { status: 400 }
      )
    }

    if (
      updates.hasOwnProperty('is_archived') &&
      typeof updates.is_archived !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'is_archived must be a boolean' },
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
      updates: updates, // Return what was updated
    })
  } catch (error) {
    console.error('Error in bulk update API:', error)
    return NextResponse.json(
      { error: 'Failed to update posts' },
      { status: 500 }
    )
  }
}

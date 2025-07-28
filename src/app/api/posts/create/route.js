import { supabase } from '@/utils/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // Extract token and verify user
    const token = authHeader.replace('Bearer ', '')

    // Set the session for this request
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const content = formData.get('content')
    const imageFile = formData.get('image')

    // Validate content
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      )
    }

    if (content.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Post content must be less than 2000 characters' },
        { status: 400 }
      )
    }

    let imageUrl = null
    let imagePath = null
    let imageBucket = null

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate image
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ]
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Please use JPG, PNG, GIF, or WebP' },
          { status: 400 }
        )
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { error: 'Image must be less than 5MB' },
          { status: 400 }
        )
      }

      // Create unique filename
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`

      // Convert File to ArrayBuffer for Supabase
      const arrayBuffer = await imageFile.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, uint8Array, {
          contentType: imageFile.type,
          cacheControl: '3600',
        })

      if (uploadError) {
        console.error('Image upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        )
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('post-images').getPublicUrl(uploadData.path)

      imageUrl = publicUrl
      imagePath = uploadData.path
      imageBucket = 'post-images'
    }

    // Create post in database
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content: content.trim(),
        image_url: imageUrl,
        image_path: imagePath,
        image_bucket: imageBucket,
      })
      .select(
        `
        id,
        content,
        image_url,
        created_at,
        user_id
      `
      )
      .single()

    if (postError) {
      console.error('Post creation error:', postError)

      // If post creation failed but image was uploaded, clean up the image
      if (imagePath) {
        await supabase.storage.from('post-images').remove([imagePath])
      }

      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post: postData,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

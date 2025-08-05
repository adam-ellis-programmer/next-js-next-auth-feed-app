import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  console.log('🚀 API Route Hit - Create Post')

  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Auth header present:', !!authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Missing or invalid auth header')
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '')
    console.log('🎫 Token extracted, length:', token.length)
    console.log('token---->', token)

    // Create Supabase client with user session for RLS
    // Session-Aware Client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // Verify user with the session-aware client
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log('👤 User verification:', {
      userExists: !!user,
      userId: user?.id,
      authError: authError?.message,
    })

    if (authError || !user) {
      console.log('❌ Auth failed:', authError?.message)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const content = formData.get('content')
    const imageFile = formData.get('image')

    console.log('📝 Form data:', {
      contentLength: content?.length,
      hasImage: !!imageFile && imageFile.size > 0,
      imageSize: imageFile?.size,
    })

    // Validate content
    if (!content || content.trim().length === 0) {
      console.log('❌ Empty content')
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      )
    }

    if (content.trim().length > 2000) {
      console.log('❌ Content too long:', content.trim().length)
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
      console.log('🖼️ Processing image upload...')

      // Validate image
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ]
      if (!allowedTypes.includes(imageFile.type)) {
        console.log('❌ Invalid image type:', imageFile.type)
        return NextResponse.json(
          { error: 'Invalid image type. Please use JPG, PNG, GIF, or WebP' },
          { status: 400 }
        )
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024
      if (imageFile.size > maxSize) {
        console.log('❌ Image too large:', imageFile.size)
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

      console.log('📁 Generated filename:', fileName)

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

      console.log('☁️ Storage upload result:', {
        success: !!uploadData,
        error: uploadError?.message,
        path: uploadData?.path,
      })

      if (uploadError) {
        console.error('❌ Image upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        )
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('post-images').getPublicUrl(uploadData.path)

      console.log('🔗 Generated public URL:', publicUrl)

      imageUrl = publicUrl
      imagePath = uploadData.path
      imageBucket = 'post-images'
    } else {
      console.log('📝 Text-only post (no image)')
    }

    console.log('💾 Attempting to create post in database...')
    console.log('🔐 Using user ID for RLS:', user.id)

    // Create post in database using the session-aware client
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

    console.log('📊 Database insert result:', {
      success: !!postData,
      error: postError?.message,
      postErrorCode: postError?.code,
      postId: postData?.id,
    })

    if (postError) {
      console.error('❌ Post creation error:', postError)

      // If post creation failed but image was uploaded, clean up the image
      if (imagePath) {
        console.log('🧹 Cleaning up uploaded image...')
        await supabase.storage.from('post-images').remove([imagePath])
      }

      return NextResponse.json(
        { error: 'Failed to create post: ' + postError.message },
        { status: 500 }
      )
    }

    console.log('✅ Post created successfully:', postData.id)

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post: postData,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('💥 Unexpected error in create post API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

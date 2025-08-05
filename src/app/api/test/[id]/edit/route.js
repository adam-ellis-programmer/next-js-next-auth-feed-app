// // src/app/api/posts/[id]/edit/route.js
// import { NextResponse } from 'next/server'
// import { jwtVerify } from 'jose'
// import { getPostForEdit, updatePost } from '@/lib/data'
// import { supabase } from '@/utils/supabase'

// // Helper function to verify JWT and check user status
// async function authenticateAndCheckUser(request) {
//   const authHeader = request.headers.get('authorization')

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return { error: 'Missing or invalid authorization header', status: 401 }
//   }

//   const token = authHeader.replace('Bearer ', '')

//   try {
//     // Verify JWT with Jose
//     const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET)
//     const { payload } = await jwtVerify(token, secret)

//     const userId = payload.sub // User ID from JWT

//     // Check user status in database
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('id, email, is_suspended, suspended_reason')
//       .eq('id', userId)
//       .single()

//     if (error) {
//       console.error('User lookup error:', error)
//       return { error: 'User not found', status: 404 }
//     }

//     // Check if user is suspended
//     if (user.is_suspended) {
//       return {
//         error: 'Account suspended',
//         status: 403,
//         suspended: true,
//         suspendedReason: user.suspended_reason,
//       }
//     }

//     return { user, userId }
//   } catch (error) {
//     console.error('JWT verification error:', error)
//     return { error: 'Invalid or expired token', status: 401 }
//   }
// }

// // GET - Fetch post for editing
// export async function GET(request, { params }) {
//   try {
//     const authResult = await authenticateAndCheckUser(request)

//     if (authResult.error) {
//       return NextResponse.json(
//         {
//           error: authResult.error,
//           suspended: authResult.suspended || false,
//           suspendedReason: authResult.suspendedReason,
//         },
//         { status: authResult.status }
//       )
//     }

//     const { userId } = authResult
//     const postId = params.id

//     // Check ownership and fetch post
//     const post = await getPostForEdit(postId, userId)

//     if (!post) {
//       return NextResponse.json(
//         { error: 'Post not found or you do not have permission to edit it' },
//         { status: 403 }
//       )
//     }

//     return NextResponse.json({ post })
//   } catch (error) {
//     console.error('API error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

// // PUT - Update post
// export async function PUT(request, { params }) {
//   try {
//     const authResult = await authenticateAndCheckUser(request)

//     if (authResult.error) {
//       return NextResponse.json(
//         {
//           error: authResult.error,
//           suspended: authResult.suspended || false,
//           suspendedReason: authResult.suspendedReason,
//         },
//         { status: authResult.status }
//       )
//     }

//     const { userId } = authResult
//     const postId = params.id
//     const updates = await request.json()

//     // Validate updates
//     if (!updates.content?.trim()) {
//       return NextResponse.json(
//         { error: 'Content is required' },
//         { status: 400 }
//       )
//     }

//     // Update post
//     const result = await updatePost(
//       postId,
//       {
//         content: updates.content.trim(),
//         image_url: updates.image_url || null,
//       },
//       userId
//     )

//     if (!result.success) {
//       return NextResponse.json({ error: result.error }, { status: 400 })
//     }

//     return NextResponse.json({
//       message: 'Post updated successfully',
//       post: result.data,
//     })
//   } catch (error) {
//     console.error('API error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

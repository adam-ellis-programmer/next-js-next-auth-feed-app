// import { supabase } from '@/utils/supabase'
// import { NextResponse } from 'next/server'

// export async function POST(request) {
//   try {
//     const { email, password, rememberMe } = await request.json()

//     // Validate required fields
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       )
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 }
//       )
//     }

//     // Attempt to sign in with Supabase Auth
//     const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     if (authError) {
//       console.error('Auth error:', authError)
      
//       // Handle specific error cases
//       if (authError.message.includes('Invalid login credentials')) {
//         return NextResponse.json(
//           { error: 'Invalid email or password' },
//           { status: 401 }
//         )
//       }
      
//       if (authError.message.includes('Email not confirmed')) {
//         return NextResponse.json(
//           { error: 'Please check your email and click the confirmation link before signing in' },
//           { status: 401 }
//         )
//       }

//       return NextResponse.json(
//         { error: authError.message },
//         { status: 401 }
//       )
//     }

//     // Check if user and session exist
//     if (!authData.user || !authData.session) {
//       return NextResponse.json(
//         { error: 'Authentication failed' },
//         { status: 401 }
//       )
//     }

//     // Get user profile data from your custom users table
//     const { data: profileData, error: profileError } = await supabase
//       .from('users')
//       .select('id, email, first_name, last_name, full_name, avatar_url, bio')
//       .eq('id', authData.user.id)
//       .single()

//     if (profileError) {
//       console.error('Profile fetch error:', profileError)
//       // Continue without profile data - user can still sign in
//     }

//     // Prepare response data
//     const responseData = {
//       message: 'Login successful',
//       user: {
//         id: authData.user.id,
//         email: authData.user.email,
//         emailConfirmed: authData.user.email_confirmed_at ? true : false,
//         lastSignIn: authData.user.last_sign_in_at,
//         // Include profile data if available
//         ...(profileData && {
//           firstName: profileData.first_name,
//           lastName: profileData.last_name,
//           fullName: profileData.full_name,
//           avatarUrl: profileData.avatar_url,
//           bio: profileData.bio,
//         }),
//       },
//       session: {
//         access_token: authData.session.access_token,
//         refresh_token: authData.session.refresh_token,
//         expires_at: authData.session.expires_at,
//         expires_in: authData.session.expires_in,
//       },
//       // Include remember me preference (could be used for frontend logic)
//       rememberMe: rememberMe || false,
//     }

//     return NextResponse.json(responseData, { status: 200 })

//   } catch (error) {
//     console.error('Login error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }
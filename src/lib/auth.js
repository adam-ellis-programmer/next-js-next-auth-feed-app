// src/lib/auth.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { NextResponse } from 'next/server'

// ============ AUTH HELPERS ============
// Get authenticated user with full database lookup (like your MERN pattern)
export const getAuthenticatedUser = cache(async () => {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // 1. Get JWT from Supabase (handles cookies automatically)
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return { user: null, error: 'Not authenticated' }
    }

    // 2. Look up full user record (like User.findById() in MERN)
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (dbError || !dbUser) {
      return { user: null, error: 'User not found in database' }
    }

    // 3. Check user status (like your MERN middleware)
    if (dbUser.is_suspended) {
      return { user: null, error: 'Account suspended' }
    }

    // 4. Return combined user data
    return {
      user: { ...authUser, ...dbUser },
      error: null,
    }
  } catch (error) {
    return { user: null, error: 'Authentication failed' }
  }
})

// Admin check (like checking req.user.isAdmin in MERN)
export const requireAdmin = cache(async () => {
  const { user, error } = await getAuthenticatedUser()

  if (error) return { user: null, error }

  if (!user.is_admin) {
    return { user: null, error: 'Admin access required' }
  }

  return { user, error: null }
})

// Demo user check (based on your existing checkIsDemoUser function)
export const requireNonDemoUser = cache(async () => {
  const { user, error } = await getAuthenticatedUser()

  if (error) return { user: null, error }

  if (user.demo_user) {
    return { user: null, error: 'Demo users cannot perform this action' }
  }

  return { user, error: null }
})

// ============ HIGHER-ORDER FUNCTION ============
export function withAuth(handler, options = {}) {
  return async function (request, context) {
    try {
      let authResult

      // Choose auth level based on options (like different middleware in Express)
      if (options.adminRequired) {
        authResult = await requireAdmin()
      } else if (options.nonDemoOnly) {
        authResult = await requireNonDemoUser()
      } else {
        authResult = await getAuthenticatedUser()
      }

      if (authResult.error) {
        const statusCode = getStatusCode(authResult.error)
        return NextResponse.json(
          { error: authResult.error },
          { status: statusCode }
        )
      }

      // Attach user to request (like req.user in Express)
      request.user = authResult.user

      // Call the actual handler (like next() in Express)
      return handler(request, context)
    } catch (error) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
  }
}

// Helper function for status codes
function getStatusCode(errorMessage) {
  if (
    errorMessage.includes('Not authenticated') ||
    errorMessage.includes('User not found')
  )
    return 401
  if (
    errorMessage.includes('suspended') ||
    errorMessage.includes('Admin') ||
    errorMessage.includes('Demo')
  )
    return 403
  return 500
}

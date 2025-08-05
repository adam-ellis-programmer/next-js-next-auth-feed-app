// src/middleware.js - Keep it simple for authentication only
import { NextResponse } from 'next/server'

export function middleware(request) {
  // // Only check if user is authenticated
  // const token = request.cookies.get('sb-access-token')?.value

  // // Protected routes that require login
  // const protectedRoutes = ['/posts/create', '/posts/edit', '/auth/dashboard']
  // const isProtectedRoute = protectedRoutes.some((route) =>
  //   request.nextUrl.pathname.startsWith(route)
  // )

  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  // }

  return NextResponse.next()
}

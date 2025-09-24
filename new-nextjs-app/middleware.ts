import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Role-based route protection at the edge
export function middleware(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl

  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  const isAdminPath = pathname.startsWith('/admin')
  const isAgentPath = pathname.startsWith('/agent')
  const isSubscriptionPath = pathname.startsWith('/subscriptions')

  // Helper: redirect to login with return path
  const redirectToLogin = () => {
    const url = new URL('/login', origin)
    url.searchParams.set('next', pathname + (search || ''))
    return NextResponse.redirect(url)
  }

  // Create response with proper headers
  const createResponse = (response: NextResponse) => {
    // Add payment-specific headers for subscription pages
    if (isSubscriptionPath) {
      response.headers.set('Permissions-Policy', 'payment=*, otp-credentials=*')
      response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    }
    return response
  }

  // Admin guard
  if (isAdminPath) {
    if (!token) return redirectToLogin()
    if (role !== 'admin') return NextResponse.redirect(new URL('/', origin))
    return createResponse(NextResponse.next())
  }

  // Agent guard (allow admin as well)
  if (isAgentPath) {
    if (!token) return redirectToLogin()
    if (role !== 'agent' && role !== 'admin') return NextResponse.redirect(new URL('/', origin))
    return createResponse(NextResponse.next())
  }

  return createResponse(NextResponse.next())
}

// Apply to all routes except assets and API
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
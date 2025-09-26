import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Performance headers
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`)
  
  // Enable GZIP compression hint
  response.headers.set('Vary', 'Accept-Encoding')
  
  // Cache control for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Cache control for images
  if (request.nextUrl.pathname.startsWith('/images/') || 
      request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=31536000')
  }
  
  // Preload critical resources for main pages
  if (request.nextUrl.pathname === '/') {
    response.headers.set('Link', '</images/hero-bg.jpg>; rel=preload; as=image')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
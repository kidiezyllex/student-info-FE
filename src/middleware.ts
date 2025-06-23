import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const hasAccessToken = request.cookies.has('accessToken') &&
    request.cookies.get('accessToken')?.value;
  const isPublicRoute = path === '/login' || path.includes('sign-up');
  const isApiRoute = path.startsWith('/api/');

  if (isApiRoute) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Handle the actual API request
    const response = NextResponse.next();
    
    // Add CORS headers to the response
    const origin = request.headers.get('origin') || '*';
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }

  // Authentication check for non-API routes - redirect to login if no token
  if (!hasAccessToken && !isPublicRoute) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user has token and trying to access login page, redirect to admin
  if (hasAccessToken && isPublicRoute) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/',
    '/app/:path*',
    '/api/v1/:path*',
    '/((?!_next|_vercel|favicon.ico|.*\\..*).*)' 
  ]
};
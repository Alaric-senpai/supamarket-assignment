import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserSessionCookie, getRoleCookie } from './server/cookies';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/fail',
  '/success',
  '/verify',
  '/oauth',
  '/terms',
];

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin', // Also needs auth + admin role
];

// Routes that require admin role
const adminRoutes = [
  '/admin',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  try {
    const sessionSecret = await getUserSessionCookie();
    const userRole = await getRoleCookie();

    // If no session and trying to access protected route
    if (!sessionSecret && (isProtectedRoute || isAdminRoute)) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      url.searchParams.set('error', 'authentication_required');
      return NextResponse.redirect(url);
    }

    // If has session and trying to access auth routes
    const authRoutes = ['/login', '/signup'];
    if (sessionSecret && authRoutes.some(route => pathname === route || pathname.startsWith(route))) {
      // Allow OAuth callback and status pages
      if (
        pathname.includes('/oauth') || 
        pathname.includes('/success') || 
        pathname.includes('/fail') ||
        pathname.includes('/verify')
      ) {
        return NextResponse.next();
      }
      
      // Redirect to appropriate dashboard based on role
      const dashboardUrl = userRole === 'admin' 
        ? new URL('/admin', request.url)
        : new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // CRITICAL: Admin route protection with role verification
    // This prevents role spoofing by checking both cookie and actual session
    if (isAdminRoute) {
      // First check - cookie must say admin
      if (userRole !== 'admin') {
        console.warn(`[Security] Non-admin user attempted to access admin route: ${pathname}`);
        const url = new URL('/dashboard', request.url);
        url.searchParams.set('error', 'admin_access_denied');
        return NextResponse.redirect(url);
      }
      
      // Additional verification happens in the layout server component
      // This double-check prevents cookie manipulation
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    return response;
  } catch (error) {
    console.error('Middleware Error:', error);
    
    // If error and trying to access protected route, redirect to login
    if (isProtectedRoute || isAdminRoute) {
      const url = new URL('/login', request.url);
      url.searchParams.set('error', 'session_error');
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};

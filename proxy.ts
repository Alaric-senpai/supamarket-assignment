import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_COOKIE, SESSION_COOKIE } from './lib/utils';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get cookies
    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    const roleCookie = request.cookies.get(ROLE_COOKIE);

    const isLoggedIn = !!sessionCookie?.value;
    const userRole = roleCookie?.value;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/signup', '/oauth', '/fail'];
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'));

    // If not logged in and trying to access protected route
    if (!isLoggedIn && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If logged in and trying to access auth pages, redirect to appropriate dashboard
    if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
        if (userRole === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        } else {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Role-based access control
    if (isLoggedIn) {
        // Admin trying to access client routes
        if (userRole === 'admin' && pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        // Client trying to access admin routes
        if (userRole === 'client' && pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.json/manifest.webmanifest
         * - static assets with common extensions
         */
        '/((?!api|_next/static|_next/image|favicon.ico|manifest\\.(?:json|webmanifest)|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf|mp4|webm|wav|mp3|m4a|aac|oga)$).*)',
    ],
};

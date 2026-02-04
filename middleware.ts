import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('soy_fungi_user');
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/signup'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not logged in and trying to access protected route
    if (!sessionCookie && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user is logged in and trying to access login/signup, redirect to campaigns
    if (sessionCookie && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/campaigns', request.url));
    }

    // Redirect root to login if not authenticated, campaigns if authenticated
    if (pathname === '/') {
        if (sessionCookie) {
            return NextResponse.redirect(new URL('/campaigns', request.url));
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
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
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = [
    '/profile',
    '/create-post',
    '/settings',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if path is protected
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        // Check for token in cookies (best practice) or headers
        // Note: LocalStorage is client-side only, so middleware (server-side) can't see it.
        // However, if we are strictly using Client Side auth (context), middleware might not be able to fully validate.
        // For a robust app, we should use cookies. 
        // BUT, for this rapid prototype, we rely on client-side AuthContext for redirection mainly.
        // This middleware is a placeholder for future cookie-based auth.
        // We can rely on client-side check in AuthContext for now for localStorage based auth.

        // Changing strategy: Since we store token in localStorage, middleware cannot access it.
        // We will skip middleware enforcement for now and rely on AuthContext.tsx 
        // or we'd need to migrate to cookies.
        // User asked for "Protect private routes", AuthContext does this client-side.
        return NextResponse.next();
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

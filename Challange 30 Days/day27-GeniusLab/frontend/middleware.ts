import { NextResponse } from 'next/server'


export function middleware() {
    // With token-based auth (Bearer tokens stored in localStorage),
    // we can't check auth state in middleware (server-side).
    // Auth protection is handled client-side in the dashboard layout.
    // Middleware just ensures routes are accessible.
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/login',
        '/register',
        '/chat/:path*',
        '/templates/:path*',
        '/wallet/:path*',
        '/settings/:path*'
    ],
}

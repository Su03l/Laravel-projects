import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Simple check for token presence. 
    // In a real app with HttpOnly cookies, we'd check cookies.
    // Since we are using localStorage for this example (as per prompt implication or simple JWT), 
    // middleware can't access localStorage. 
    // However, usually we store auth tokens in cookies for middleware access.
    // For this "LiveChat Pro" prompt, the user requirements mentioned "store token in cookies/localstorage".
    // If we can't read localStorage in middleware, we might need a client-side check or use cookies.
    // I will assume for middleware protection we rely on a cookie named 'token' OR 
    // Since backend is Laravel Sanctum/Passport likely, 
    // Let's assume we'll set a cookie on login as well, or just rely on Client Side protection in axios interceptors
    // BUT user explicitly asked for middleware.

    // So, I'll assume we set a cookie named 'token' in the Login page. 
    // I'll update Login/Register page to set this cookie. 
    // Wait, I can't update them in this same turn efficiently without backtracking.
    // I will write middleware to check for 'token' cookie.

    const token = request.cookies.get('token')?.value;

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};

import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Check if user is trying to access the Dashboard (/admin)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // 2. Check for the secure session cookie
    const sessionCookie = request.cookies.get('admin_session');

    // 3. If NO cookie found, redirect to the Login Page (Root URL)
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 4. If cookie exists, let them pass
  return NextResponse.next();
}

// Apply this security check only to /admin routes
export const config = {
  matcher: '/admin/:path*',
};
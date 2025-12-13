// backend/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the user is trying to access any route under /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Check for the secure session cookie
    const sessionCookie = request.cookies.get('admin_session');

    // If the cookie is NOT present, redirect them to the frontend login page
    if (!sessionCookie) {
      // Redirect to the external (frontend) login page
      return NextResponse.redirect(new URL('/login', 'https://hillway.in'));
    }
  }

  // Allow access to all other routes (and authenticated admin users)
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  // This will run the check on /admin and all subpaths like /admin/tours
  matcher: '/admin/:path*', 
};
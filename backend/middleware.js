import { NextResponse } from 'next/server';

export function middleware(request) {
  const origin = request.headers.get('origin');
  const { pathname } = request.nextUrl;
  
  // List all domains you want to allow
  const allowedOrigins = [
    'https://hillway.in', 
    'https://www.hillway.in',
    'https://admin.hillway.in',
    'http://localhost:5173', // For local Vite development
    'http://localhost:3000'  // For local Next.js development
  ];

  // --- 1. HANDLE CORS PREFLIGHT (OPTIONS REQUESTS) ---
  if (request.method === 'OPTIONS') {
     const response = new NextResponse(null, { status: 200 });
     if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
     }
     return response;
  }

  // --- 2. PREPARE RESPONSE & ADD HEADERS ---
  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // --- 3. ROUTE HANDLING LOGIC ---

  // A. Admin Routes (Secure Check)
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response; // Authorized
  }

  // B. Allowed Routes (Let these pass)
  if (
    pathname === '/' ||                          // Login Page
    pathname.startsWith('/api') ||               // Backend API
    pathname.startsWith('/_next') ||             // Next.js Internals
    pathname.match(/\.(svg|png|jpg|ico|json)$/)  // Public Assets
  ) {
    return response;
  }

  // C. CATCH-ALL: Redirect everything else to Login Page
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  // Match ALL routes so we can catch the unknown ones
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get user role from cookie (in production, use secure session/JWT)
  const userRole = request.cookies.get('user_role')?.value;
  const isAuthenticated = request.cookies.get('is_authenticated')?.value === 'true';
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/', 
    '/how-it-works', 
    '/about', 
    '/contact', 
    '/auth',
    '/vehicle-confirmation',
    '/parts-selection',
    '/supplier-profile'
  ];
  
  const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p));
  
  // Skip middleware for Next.js internals and static files
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.includes('.') // static files
  ) {
    return NextResponse.next();
  }
  
  // Admin routes protection
  if (path.startsWith('/admin')) {
    if (!isAuthenticated || userRole !== 'admin') {
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', path);
      url.searchParams.set('role', 'admin');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  
  // Supplier routes protection
  if (path.startsWith('/supplier')) {
    // Allow onboarding without strict auth check
    if (path === '/supplier/onboarding') {
      return NextResponse.next();
    }
    
    if (!isAuthenticated || userRole !== 'supplier') {
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', path);
      url.searchParams.set('role', 'supplier');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  
  // Customer routes protection
  if (path.startsWith('/customer')) {
    if (!isAuthenticated || userRole !== 'customer') {
      const url = new URL('/auth', request.url);
      url.searchParams.set('redirect', path);
      url.searchParams.set('role', 'customer');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (meta files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

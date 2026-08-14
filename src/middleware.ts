import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('borsai_session');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Giriş çerezi yoksa ve login sayfasında değilse -> /login'e yönlendir
  if (!authCookie && !isLoginPage && !request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
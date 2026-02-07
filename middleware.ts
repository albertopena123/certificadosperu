import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas del admin
  const isLoginPage = pathname === '/admin/login';
  const isApiAuthRoute = pathname.startsWith('/api/auth');

  // Permitir rutas de autenticación
  if (isApiAuthRoute || isLoginPage) {
    return NextResponse.next();
  }

  // Verificar si hay sesión (cookie de NextAuth)
  const sessionToken = request.cookies.get('authjs.session-token') ||
                       request.cookies.get('__Secure-authjs.session-token');

  // Si no hay sesión y está intentando acceder al admin, redirigir al login
  if (!sessionToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

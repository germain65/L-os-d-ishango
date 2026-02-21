import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes publiques (ne nécessitent pas d'authentification)
const publicRoutes = [
  '/',
  '/inscription',
  '/connexion',
  '/mot-de-passe-oublie',
  '/reset-password',
  '/verify-email',
  '/conditions',
  '/confidentialite',
];

// Routes d'API (à exclure du middleware)
const apiRoutes = ['/api/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les routes d'API
  if (apiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Ignorer les fichiers statiques
  if (
    pathname.includes('.') || // fichiers avec extension (images, css, js)
    pathname.startsWith('/_next/') || // fichiers Next.js
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.includes(pathname) || 
    publicRoutes.some(route => pathname.startsWith(route));

  // Récupérer le token d'accès depuis les cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // Si la route est privée et que l'utilisateur n'est pas authentifié
  if (!isPublicRoute && !accessToken) {
    // Rediriger vers la page de connexion avec l'URL originale
    const loginUrl = new URL('/connexion', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à une page d'auth
  if (accessToken && (pathname === '/connexion' || pathname === '/inscription')) {
    // Rediriger vers le dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
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

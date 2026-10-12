import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, SITE_COOKIE, sitePassword, verifySession, verifySiteToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  // 1. Beheeromgeving: eigen login
  if (isAdmin) {
    if (pathname === '/admin/login' || pathname === '/api/admin/login') return noindex(NextResponse.next());
    const ok = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (ok) return noindex(NextResponse.next());
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // 2. Publieke site: tijdelijk wachtwoord (alleen actief als SITE_PASSWORD is gezet)
  if (!sitePassword()) return NextResponse.next();
  if (pathname === '/toegang' || pathname === '/api/toegang') return noindex(NextResponse.next());
  if (await verifySiteToken(req.cookies.get(SITE_COOKIE)?.value)) return noindex(NextResponse.next());
  // Ingelogde beheerder mag de site ook zien
  if (await verifySession(req.cookies.get(SESSION_COOKIE)?.value)) return noindex(NextResponse.next());
  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Geen toegang' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/toegang';
  url.search = pathname !== '/' ? `?naar=${encodeURIComponent(pathname)}` : '';
  return NextResponse.redirect(url);
}

function noindex(res: NextResponse) {
  if (sitePassword()) res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.svg|favicon.ico|robots.txt).*)'],
};

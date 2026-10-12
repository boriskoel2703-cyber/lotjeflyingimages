import { NextResponse } from 'next/server';
import { SITE_COOKIE, sitePassword, siteToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  await new Promise((r) => setTimeout(r, 400));
  if (!sitePassword() || String(password || '').trim() !== sitePassword()) {
    return NextResponse.json({ error: 'Onjuist wachtwoord.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SITE_COOKIE, await siteToken(), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

import { NextResponse } from 'next/server';
import { adminCredentials, createSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const creds = adminCredentials();
  if (!creds.password) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is nog niet ingesteld in Vercel.' }, { status: 500 });
  }
  await new Promise((r) => setTimeout(r, 400));
  if (String(email || '').trim().toLowerCase() !== creds.email || password !== creds.password) {
    return NextResponse.json({ error: 'Onjuist e-mailadres of wachtwoord.' }, { status: 401 });
  }
  const { token, maxAge } = await createSession(creds.email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge });
  return res;
}

// Werkt zowel in middleware (edge) als in route handlers (node): alleen Web Crypto.
export const SESSION_COOKIE = 'lotje_session';
const MAX_AGE = 60 * 60 * 24 * 14; // 14 dagen

function secret() {
  const s = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== 'production' ? 'dev-secret' : '');
  return s;
}

export function adminCredentials() {
  const dev = process.env.NODE_ENV !== 'production';
  return {
    email: (process.env.ADMIN_EMAIL || 'admin@lotje.nl').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || (dev ? 'lotje' : ''),
  };
}

const b64 = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

async function hmac(data: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(email: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${b64(email)}.${exp}`;
  return { token: `${payload}.${await hmac(payload)}`, maxAge: MAX_AGE };
}

export async function verifySession(token?: string | null): Promise<string | null> {
  if (!token || !secret()) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [email, exp, sig] = parts;
  if (Number(exp) < Date.now() / 1000) return null;
  const expected = await hmac(`${email}.${exp}`);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    return unb64(email);
  } catch {
    return null;
  }
}

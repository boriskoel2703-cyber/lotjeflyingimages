// Alleen voor lokaal ontwikkelen zonder Vercel Blob: serveert .data/uploads/*
import { promises as fs } from 'fs';
import path from 'path';
import { LOCAL_UPLOADS } from '@/lib/store';

const TYPES: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const name = path.basename((await params).file);
  try {
    const buf = await fs.readFile(path.join(LOCAL_UPLOADS, name));
    return new Response(new Uint8Array(buf), { headers: { 'Content-Type': TYPES[path.extname(name).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch {
    return new Response('Niet gevonden', { status: 404 });
  }
}

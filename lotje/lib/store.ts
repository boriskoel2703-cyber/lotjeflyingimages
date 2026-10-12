import { put, list, del } from '@vercel/blob';
import { unstable_cache, revalidateTag } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';
import { mergeContent } from './defaults';
import type { Content, Submission } from './types';

/**
 * Opslag:
 * - Op Vercel: Vercel Blob (BLOB_READ_WRITE_TOKEN). Elke save schrijft een nieuwe
 *   content/<tijd>.json (unieke URL = geen cache-problemen). De 10 laatste blijven bewaard als backup.
 * - Lokaal zonder token: .data/content.json en public/uploads.
 */
const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_CONTENT = path.join(DATA_DIR, 'content.json');
const KEEP_VERSIONS = 10;
export const LOCAL_UPLOADS = path.join(DATA_DIR, 'uploads');

function assertWritable() {
  if (!hasBlob() && process.env.VERCEL) {
    throw new Error(
      'Opslag is nog niet gekoppeld. Maak in Vercel een Blob-store aan (Storage → Create → Blob) en koppel die aan dit project, daarna opnieuw deployen.'
    );
  }
}

async function readContentRaw(): Promise<Content> {
  if (!hasBlob()) {
    try {
      return mergeContent(JSON.parse(await fs.readFile(LOCAL_CONTENT, 'utf8')));
    } catch {
      return mergeContent(null);
    }
  }
  try {
    const { blobs } = await list({ prefix: 'content/', limit: 100 });
    if (!blobs.length) return mergeContent(null);
    const latest = [...blobs].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];
    const res = await fetch(latest.url, { cache: 'no-store' });
    return mergeContent(await res.json());
  } catch (e) {
    console.error('Content laden mislukt', e);
    return mergeContent(null);
  }
}

/** Gecachete versie voor de publieke site; wordt ververst na elke save. */
export const getContent = unstable_cache(readContentRaw, ['site-content-v1'], { tags: ['content'] });

/** Ongecachet, voor de beheeromgeving. */
export const getContentFresh = readContentRaw;

export async function writeContent(content: Content) {
  assertWritable();
  content.updatedAt = new Date().toISOString();
  const json = JSON.stringify(content);
  if (!hasBlob()) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(LOCAL_CONTENT, json);
  } else {
    await put(`content/${Date.now()}.json`, json, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: true,
      cacheControlMaxAge: 60,
    });
    try {
      const { blobs } = await list({ prefix: 'content/', limit: 100 });
      const old = [...blobs]
        .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
        .slice(KEEP_VERSIONS)
        .map((b) => b.url);
      if (old.length) await del(old);
    } catch (e) {
      console.error('Opruimen oude versies mislukt', e);
    }
  }
  revalidateTag('content');
  return content;
}

export async function updateContent(mutator: (c: Content) => void | Content) {
  const current = await readContentRaw();
  const next = (mutator(current) as Content | undefined) || current;
  return writeContent(next);
}

/* ---------- Uploads ---------- */

export async function saveUpload(file: File): Promise<string> {
  assertWritable();
  const safe = (file.name || 'foto.jpg').toLowerCase().replace(/[^a-z0-9.\-]+/g, '-').slice(-60);
  if (hasBlob()) {
    const blob = await put(`uploads/${safe}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });
    return blob.url;
  }
  await fs.mkdir(LOCAL_UPLOADS, { recursive: true });
  const name = `${Date.now()}-${safe}`;
  await fs.writeFile(path.join(LOCAL_UPLOADS, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function deleteUpload(url: string) {
  if (!url) return;
  try {
    if (hasBlob() && url.includes('blob.vercel-storage.com')) await del(url);
    else if (!hasBlob() && url.startsWith('/uploads/')) await fs.unlink(path.join(LOCAL_UPLOADS, path.basename(url)));
  } catch (e) {
    console.error('Verwijderen upload mislukt', e);
  }
}

/* ---------- Aanvragen (contactformulier) ---------- */

const LOCAL_SUBS = path.join(DATA_DIR, 'submissions.json');

export async function addSubmission(s: Submission) {
  assertWritable();
  if (hasBlob()) {
    await put(`submissions/${s.createdAt.replace(/[:.]/g, '-')}-${s.id}.json`, JSON.stringify(s), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: true,
    });
    return;
  }
  const all = await listSubmissions();
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LOCAL_SUBS, JSON.stringify([s, ...all]));
}

export async function listSubmissions(): Promise<(Submission & { _ref?: string })[]> {
  if (!hasBlob()) {
    try {
      return JSON.parse(await fs.readFile(LOCAL_SUBS, 'utf8'));
    } catch {
      return [];
    }
  }
  const { blobs } = await list({ prefix: 'submissions/', limit: 500 });
  const items = await Promise.all(
    blobs.map(async (b) => {
      try {
        const r = await fetch(b.url, { cache: 'no-store' });
        return { ...(await r.json()), _ref: b.url } as Submission & { _ref: string };
      } catch {
        return null;
      }
    })
  );
  return items
    .filter((x): x is Submission & { _ref: string } => !!x)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteSubmission(id: string) {
  if (!hasBlob()) {
    const all = await listSubmissions();
    await fs.writeFile(LOCAL_SUBS, JSON.stringify(all.filter((s) => s.id !== id)));
    return;
  }
  const all = await listSubmissions();
  const hit = all.find((s) => s.id === id);
  if (hit?._ref) await del(hit._ref);
}

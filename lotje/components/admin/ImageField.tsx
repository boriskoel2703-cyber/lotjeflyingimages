'use client';
import { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

/** Verkleint foto's in de browser (max 2000px, JPEG/WebP) voor ze worden geüpload. */
export async function resizeImage(file: File, max = 2000): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const type = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, type, 0.85));
    if (!blob) return file;
    const ext = type === 'image/webp' ? 'webp' : 'jpg';
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.' + ext, { type });
  } catch {
    return file;
  }
}

export async function uploadImage(file: File): Promise<string> {
  const small = await resizeImage(file);
  const fd = new FormData();
  fd.append('file', small);
  const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'Upload mislukt');
  return data.url;
}

export function ImageField({ value, onChange, onError }: { value: string; onChange: (url: string) => void; onError?: (m: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function pick(f?: File) {
    if (!f) return;
    setBusy(true);
    try {
      onChange(await uploadImage(f));
    } catch (e) {
      onError?.((e as Error).message);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  }
  return (
    <div className="a-image">
      {value ? <img src={value} alt="" /> : <div className="a-image-empty">Geen afbeelding</div>}
      <div className="a-image-actions">
        <button type="button" className="a-btn a-btn-outline" onClick={() => ref.current?.click()} disabled={busy}>
          <ImagePlus size={16} /> {busy ? 'Uploaden…' : value ? 'Vervangen' : 'Uploaden'}
        </button>
        {value && (
          <button type="button" className="a-btn a-btn-ghost" onClick={() => onChange('')}><Trash2 size={16} /> Verwijderen</button>
        )}
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>
    </div>
  );
}

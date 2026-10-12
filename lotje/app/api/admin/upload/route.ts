import { NextResponse } from 'next/server';
import { deleteUpload, saveUpload } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw new Error('Geen bestand ontvangen');
    if (!file.type.startsWith('image/')) throw new Error('Alleen afbeeldingen zijn toegestaan');
    if (file.size > 4.4 * 1024 * 1024) throw new Error('Bestand is te groot (max 4 MB)');
    return NextResponse.json({ url: await saveUpload(file) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { url } = await req.json().catch(() => ({}));
  await deleteUpload(url);
  return NextResponse.json({ ok: true });
}

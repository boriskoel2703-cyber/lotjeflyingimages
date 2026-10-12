import { NextResponse } from 'next/server';
import { deleteSubmission, listSubmissions } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await listSubmissions();
    return NextResponse.json(items.map(({ _ref, ...s }) => s));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json().catch(() => ({}));
  await deleteSubmission(String(id || ''));
  return NextResponse.json({ ok: true });
}

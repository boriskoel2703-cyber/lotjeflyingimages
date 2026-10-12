import { NextResponse } from 'next/server';
import { getContentFresh, updateContent } from '@/lib/store';
import type { Content, PageKey } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getContentFresh());
}

const SECTIONS = ['colors', 'settings', 'events', 'albums'] as const;
const PAGES: PageKey[] = ['home', 'evenementen', 'fotos', 'contact'];

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const saved = await updateContent((c: Content) => {
      if (body.page) {
        if (!PAGES.includes(body.page)) throw new Error('Onbekende pagina');
        c.pages[body.page as PageKey] = { ...body.value, _updatedAt: new Date().toISOString() };
      } else if (SECTIONS.includes(body.section)) {
        (c as Record<string, unknown>)[body.section] = body.value;
      } else {
        throw new Error('Onbekend onderdeel');
      }
    });
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

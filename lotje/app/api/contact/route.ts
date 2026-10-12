import { NextResponse } from 'next/server';
import { addSubmission, getContent } from '@/lib/store';
import { uid } from '@/lib/util';
import type { Submission } from '@/lib/types';

const clip = (v: unknown, n = 200) => String(v ?? '').trim().slice(0, n);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 });
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const s: Submission = {
    id: uid(),
    createdAt: new Date().toISOString(),
    type: clip(b.type, 30) || 'Feest',
    name: clip(b.name, 120),
    email: clip(b.email, 160),
    phone: clip(b.phone, 40),
    guests: clip(b.guests, 20),
    date: clip(b.date, 20),
    message: clip(b.message, 4000),
  };
  if (!s.name || !/^\S+@\S+\.\S+$/.test(s.email)) {
    return NextResponse.json({ error: 'Vul je naam en een geldig e-mailadres in.' }, { status: 400 });
  }
  try {
    await addSubmission(s);
  } catch (e) {
    console.error(e);
  }

  const key = process.env.RESEND_API_KEY;
  if (key) {
    const content = await getContent();
    const to = process.env.CONTACT_TO || content.settings.email;
    const rows = [
      ['Soort', s.type], ['Naam', s.name], ['E-mail', s.email], ['Telefoon', s.phone],
      ['Aantal gasten', s.guests], ['Gewenste datum', s.date], ['Idee', s.message],
    ];
    const html = `<h2>Nieuwe aanvraag via de website</h2><table cellpadding="6">${rows
      .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v || '–').replace(/\n/g, '<br>')}</td></tr>`)
      .join('')}</table>`;
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || 'Lotje website <onboarding@resend.dev>',
          to: [to],
          reply_to: s.email,
          subject: `Aanvraag ${s.type.toLowerCase()} – ${s.name}`,
          html,
        }),
      });
    } catch (e) {
      console.error('Mail versturen mislukt', e);
    }
  }
  return NextResponse.json({ ok: true });
}

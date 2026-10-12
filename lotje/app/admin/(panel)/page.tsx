'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CalendarDays, FileText, Images, Inbox, Palette } from 'lucide-react';
import { Loading, useAdmin } from '@/components/admin/Provider';
import type { Submission } from '@/lib/types';
import { formatNL } from '@/lib/util';

export default function Dashboard() {
  const { content } = useAdmin();
  const [subs, setSubs] = useState<Submission[] | null>(null);
  useEffect(() => {
    fetch('/api/admin/submissions').then((r) => (r.ok ? r.json() : [])).then(setSubs).catch(() => setSubs([]));
  }, []);
  if (!content) return <Loading />;
  const cards = [
    { label: "Pagina's", value: Object.keys(content.pages).length, Icon: FileText, href: '/admin/paginas' },
    { label: 'Evenementen', value: content.events.length, Icon: CalendarDays, href: '/admin/evenementen' },
    { label: 'Fotomappen', value: content.albums.length, Icon: Images, href: '/admin/fotobibliotheek' },
    { label: 'Styling-kleuren', value: Object.keys(content.colors).length, Icon: Palette, href: '/admin/styling' },
  ];
  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-h1">Dashboard</h1>
          <p className="a-sub">Beheer de inhoud van de website van Feestcafé Lotje.</p>
        </div>
      </div>
      <div className="a-stats">
        {cards.map(({ label, value, Icon, href }) => (
          <Link key={label} href={href} className="a-card a-stat">
            <div className="a-stat-top"><span>{label}</span><Icon size={20} strokeWidth={1.6} /></div>
            <strong>{value}</strong>
          </Link>
        ))}
      </div>
      <div className="a-card a-panel">
        <div className="a-panel-head">
          <h2 className="a-h2"><Inbox size={18} /> Laatste aanvragen</h2>
          <Link href="/admin/aanvragen" className="a-link">Alle aanvragen →</Link>
        </div>
        {subs === null ? (
          <p className="a-muted">Laden…</p>
        ) : subs.length === 0 ? (
          <p className="a-muted">Nog geen aanvragen via het contactformulier.</p>
        ) : (
          <ul className="a-list">
            {subs.slice(0, 5).map((s) => (
              <li key={s.id}>
                <span className="a-pill">{s.type}</span>
                <strong>{s.name}</strong>
                <span className="a-muted">{s.date ? `voor ${formatNL(s.date)}` : ''}{s.guests ? ` · ${s.guests} gasten` : ''}</span>
                <span className="a-muted a-right">{formatNL(s.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

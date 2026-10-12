'use client';
import { useEffect, useState } from 'react';
import { Mail, Phone, Trash2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/Provider';
import { formatNL, telHref } from '@/lib/util';
import type { Submission } from '@/lib/types';

export default function Requests() {
  const { toast } = useAdmin();
  const [items, setItems] = useState<Submission[] | null>(null);
  useEffect(() => {
    fetch('/api/admin/submissions').then((r) => r.json()).then((d) => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([]));
  }, []);
  async function remove(id: string) {
    if (!confirm('Deze aanvraag verwijderen?')) return;
    const r = await fetch('/api/admin/submissions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (r.ok) { setItems((x) => (x || []).filter((s) => s.id !== id)); toast('Verwijderd'); } else toast('Verwijderen mislukt', 'err');
  }
  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-h1">Aanvragen</h1>
          <p className="a-sub">Alles wat via het contactformulier binnenkomt.</p>
        </div>
      </div>
      {items === null ? (
        <p className="a-muted">Laden…</p>
      ) : items.length === 0 ? (
        <div className="a-card a-empty">Nog geen aanvragen.</div>
      ) : (
        <div className="a-stack">
          {items.map((s) => (
            <article key={s.id} className="a-card a-panel a-request">
              <div className="a-request-head">
                <div>
                  <span className="a-pill">{s.type}</span>
                  <h2 className="a-h2">{s.name}</h2>
                  <p className="a-muted">Ontvangen {formatNL(s.createdAt)} {new Date(s.createdAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button className="a-icon-btn" aria-label="Verwijderen" onClick={() => remove(s.id)}><Trash2 size={17} /></button>
              </div>
              <dl className="a-dl">
                <div><dt>E-mail</dt><dd><a href={`mailto:${s.email}`} className="a-link"><Mail size={14} /> {s.email}</a></dd></div>
                <div><dt>Telefoon</dt><dd>{s.phone ? <a href={telHref(s.phone)} className="a-link"><Phone size={14} /> {s.phone}</a> : '–'}</dd></div>
                <div><dt>Gasten</dt><dd>{s.guests || '–'}</dd></div>
                <div><dt>Datum</dt><dd>{s.date ? formatNL(s.date) : '–'}</dd></div>
              </dl>
              {s.message && <p className="a-message">{s.message}</p>}
            </article>
          ))}
        </div>
      )}
    </>
  );
}

'use client';
import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink, Save } from 'lucide-react';
import { Loading, useAdmin } from '@/components/admin/Provider';
import { ImageField } from '@/components/admin/ImageField';
import { PAGE_SCHEMA, PAGE_LABELS } from '@/lib/defaults';
import type { PageFields, PageKey } from '@/lib/types';

const URLS: Record<PageKey, string> = { home: '/', evenementen: '/evenementen', fotos: '/fotos', contact: '/contact' };

export default function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const key = slug as PageKey;
  const { content, savePage, toast } = useAdmin();
  const [form, setForm] = useState<PageFields | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (content && !form && content.pages[key]) setForm({ ...content.pages[key] });
  }, [content, form, key]);
  const schema = PAGE_SCHEMA[key];
  const groups = useMemo(() => {
    const g: Record<string, typeof schema> = {};
    (schema || []).forEach((f) => { (g[f.group || 'Algemeen'] ||= []).push(f); });
    return Object.entries(g);
  }, [schema]);

  if (!schema) return <p>Pagina niet gevonden. <Link href="/admin/paginas">Terug</Link></p>;
  if (!content || !form) return <Loading />;
  const set = (k: string, v: string) => setForm((f) => ({ ...(f as PageFields), [k]: v }));
  async function save() {
    setSaving(true);
    await savePage(key, form!);
    setSaving(false);
  }

  return (
    <>
      <Link href="/admin/paginas" className="a-back"><ArrowLeft size={16} /> Alle pagina&apos;s</Link>
      <div className="a-head">
        <div>
          <h1 className="a-h1">Pagina: {PAGE_LABELS[key]}</h1>
          <p className="a-sub">Pas de teksten aan en klik op opslaan. <a href={URLS[key]} target="_blank" rel="noopener noreferrer" className="a-link">Bekijk pagina <ExternalLink size={13} /></a></p>
        </div>
        <button className="a-btn a-btn-primary" onClick={save} disabled={saving}><Save size={17} /> {saving ? 'Opslaan…' : 'Opslaan'}</button>
      </div>
      <div className="a-stack">
        {groups.map(([group, fields]) => (
          <section key={group} className="a-card a-panel">
            <h2 className="a-h2">{group}</h2>
            <div className="a-fields">
              {fields.map((f) => (
                <label key={f.key} className={`a-field ${f.type !== 'text' ? 'a-field-wide' : ''}`}>
                  <span>{f.label}</span>
                  {f.type === 'text' && <input value={form[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} />}
                  {(f.type === 'textarea' || f.type === 'list') && (
                    <textarea rows={f.type === 'list' ? 4 : 4} value={form[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} />
                  )}
                  {f.type === 'image' && <ImageField value={form[f.key] || ''} onChange={(u) => set(f.key, u)} onError={(m) => toast(m, 'err')} />}
                  {f.help && <small>{f.help}</small>}
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="a-savebar"><button className="a-btn a-btn-primary" onClick={save} disabled={saving}><Save size={17} /> {saving ? 'Opslaan…' : 'Opslaan'}</button></div>
    </>
  );
}

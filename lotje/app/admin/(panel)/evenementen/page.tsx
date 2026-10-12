'use client';
import { useState } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Loading, useAdmin } from '@/components/admin/Provider';
import { ImageField } from '@/components/admin/ImageField';
import { CATEGORY_LABELS, formatNL, todayISO, uid } from '@/lib/util';
import type { EventItem } from '@/lib/types';

const empty = (): EventItem => ({ id: uid(), title: '', date: todayISO(), time: '21:00', category: 'feest', description: '', image: '', status: 'gepubliceerd' });

export default function Events() {
  const { content, saveSection, toast } = useAdmin();
  const [edit, setEdit] = useState<EventItem | null>(null);
  const [saving, setSaving] = useState(false);
  if (!content) return <Loading />;
  const events = [...content.events].sort((a, b) => b.date.localeCompare(a.date));
  const today = todayISO();

  async function save() {
    if (!edit) return;
    if (!edit.title.trim() || !edit.date) { toast('Vul minstens een titel en datum in', 'err'); return; }
    setSaving(true);
    const exists = content!.events.some((e) => e.id === edit.id);
    const next = exists ? content!.events.map((e) => (e.id === edit.id ? edit : e)) : [...content!.events, edit];
    if (await saveSection('events', next)) setEdit(null);
    setSaving(false);
  }
  async function remove(e: EventItem) {
    if (!confirm(`"${e.title}" verwijderen?`)) return;
    await saveSection('events', content!.events.filter((x) => x.id !== e.id));
    if (e.image) fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: e.image }) });
  }
  const set = <K extends keyof EventItem>(k: K, v: EventItem[K]) => setEdit((x) => (x ? { ...x, [k]: v } : x));

  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-h1">Evenementen</h1>
          <p className="a-sub">Agenda-items beheren. Voeg een promotieafbeelding toe voor de website.</p>
        </div>
        <button className="a-btn a-btn-primary" onClick={() => setEdit(empty())}><Plus size={18} /> Nieuw evenement</button>
      </div>
      <div className="a-card a-table-wrap">
        <table className="a-table">
          <thead><tr><th>Datum</th><th>Titel</th><th>Categorie</th><th>Status</th><th>Afbeelding</th><th className="a-right">Acties</th></tr></thead>
          <tbody>
            {events.length === 0 && (
              <tr><td colSpan={6} className="a-empty-cell">Nog geen evenementen. Voeg het eerste evenement toe.</td></tr>
            )}
            {events.map((e) => (
              <tr key={e.id} className={e.date < today ? 'a-past' : ''}>
                <td>{formatNL(e.date)}<span className="a-muted a-small"> {e.time}</span></td>
                <td><strong>{e.title}</strong></td>
                <td>{CATEGORY_LABELS[e.category]}</td>
                <td><span className={`a-status ${e.status === 'gepubliceerd' ? 'on' : ''}`}>{e.date < today ? 'Afgelopen' : e.status === 'gepubliceerd' ? 'Gepubliceerd' : 'Concept'}</span></td>
                <td>{e.image ? <img src={e.image} alt="" className="a-thumb" /> : <span className="a-muted">–</span>}</td>
                <td className="a-right a-nowrap">
                  <button className="a-action" onClick={() => setEdit({ ...e })}><Pencil size={16} /> Bewerken</button>
                  <button className="a-icon-btn" aria-label="Verwijderen" onClick={() => remove(e)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="a-modal-bg" onClick={() => setEdit(null)}>
          <div className="a-modal a-card" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
            <div className="a-modal-head">
              <h2 className="a-h2">{content.events.some((e) => e.id === edit.id) ? 'Evenement bewerken' : 'Nieuw evenement'}</h2>
              <button className="a-icon-btn" onClick={() => setEdit(null)} aria-label="Sluiten"><X size={18} /></button>
            </div>
            <div className="a-fields">
              <label className="a-field a-field-wide"><span>Titel</span><input value={edit.title} onChange={(e) => set('title', e.target.value)} placeholder="Bijv. Lotje Live: The Coverband" autoFocus /></label>
              <label className="a-field"><span>Datum</span><input type="date" value={edit.date} onChange={(e) => set('date', e.target.value)} /></label>
              <label className="a-field"><span>Tijd</span><input value={edit.time} onChange={(e) => set('time', e.target.value)} placeholder="21:00" /></label>
              <label className="a-field"><span>Categorie</span>
                <select value={edit.category} onChange={(e) => set('category', e.target.value as EventItem['category'])}>
                  {Object.entries(CATEGORY_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </label>
              <label className="a-field"><span>Status</span>
                <select value={edit.status} onChange={(e) => set('status', e.target.value as EventItem['status'])}>
                  <option value="gepubliceerd">Gepubliceerd</option>
                  <option value="concept">Concept (niet zichtbaar)</option>
                </select>
              </label>
              <label className="a-field a-field-wide"><span>Omschrijving</span><textarea rows={4} value={edit.description} onChange={(e) => set('description', e.target.value)} /></label>
              <div className="a-field a-field-wide"><span>Promotieafbeelding</span><ImageField value={edit.image} onChange={(u) => set('image', u)} onError={(m) => toast(m, 'err')} /></div>
            </div>
            <div className="a-row-actions a-modal-foot">
              <button className="a-btn a-btn-outline" onClick={() => setEdit(null)}>Annuleren</button>
              <button className="a-btn a-btn-primary" onClick={save} disabled={saving}><Save size={17} /> {saving ? 'Opslaan…' : 'Opslaan'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';
import { useRef, useState } from 'react';
import { Copy, Eye, EyeOff, FolderPlus, ImagePlus, Save, Trash2 } from 'lucide-react';
import { Loading, useAdmin } from '@/components/admin/Provider';
import { uploadImage } from '@/components/admin/ImageField';
import { slugify, uid } from '@/lib/util';
import type { Album } from '@/lib/types';

export default function PhotoLibrary() {
  const { content, saveSection, toast } = useAdmin();
  const [selId, setSelId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Album | null>(null);
  const [progress, setProgress] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  if (!content) return <Loading />;
  const albums = content.albums;

  const select = (a: Album) => { setSelId(a.id); setDraft({ ...a, photos: [...a.photos] }); };
  const persist = async (next: Album[]) => saveSection('albums', next);
  const upsert = (a: Album) => (albums.some((x) => x.id === a.id) ? albums.map((x) => (x.id === a.id ? a : x)) : [...albums, a]);

  async function newAlbum() {
    const name = prompt('Naam van de nieuwe map', 'Feestavond');
    if (!name?.trim()) return;
    let slug = slugify(name);
    while (albums.some((a) => a.slug === slug)) slug += '-2';
    const a: Album = { id: uid(), name: name.trim(), slug, description: '', visible: true, photos: [] };
    if (await persist([...albums, a])) select(a);
  }
  async function saveDraft(a = draft) {
    if (!a) return;
    const clean = { ...a, slug: slugify(a.slug || a.name) };
    if (albums.some((x) => x.slug === clean.slug && x.id !== clean.id)) { toast('Deze slug bestaat al', 'err'); return; }
    if (await persist(upsert(clean))) setDraft(clean);
  }
  async function removeAlbum() {
    if (!draft || !confirm(`Map "${draft.name}" en alle foto's verwijderen?`)) return;
    if (await persist(albums.filter((a) => a.id !== draft.id))) {
      draft.photos.forEach((p) => fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: p.url }) }));
      setDraft(null); setSelId(null);
    }
  }
  async function addPhotos(files: FileList | null) {
    if (!files?.length || !draft) return;
    const added = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploaden ${i + 1} van ${files.length}…`);
      try { added.push({ id: uid(), url: await uploadImage(files[i]), alt: '' }); }
      catch (e) { toast(`${files[i].name}: ${(e as Error).message}`, 'err'); }
    }
    setProgress('');
    if (fileRef.current) fileRef.current.value = '';
    const next = { ...draft, photos: [...draft.photos, ...added] };
    setDraft(next);
    await saveDraft(next);
  }
  async function removePhoto(id: string) {
    if (!draft) return;
    const p = draft.photos.find((x) => x.id === id);
    const next = { ...draft, photos: draft.photos.filter((x) => x.id !== id) };
    setDraft(next);
    await saveDraft(next);
    if (p) fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: p.url }) });
  }
  const shortcode = draft ? `[album ${slugify(draft.slug || draft.name)}]` : '';

  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-h1">Fotobibliotheek</h1>
          <p className="a-sub">Maak mappen aan, zet er foto&apos;s in en toon ze op de website via shortcodes.</p>
        </div>
        <button className="a-btn a-btn-primary" onClick={newAlbum}><FolderPlus size={18} /> Nieuwe map</button>
      </div>
      <div className="a-lib">
        <div className={`a-lib-list ${albums.length ? 'a-card' : 'a-dashed'}`}>
          {albums.length === 0 ? (
            <p className="a-muted a-center">Nog geen mappen. Maak er een aan om te beginnen.</p>
          ) : (
            albums.map((a) => (
              <button key={a.id} className={`a-album ${selId === a.id ? 'active' : ''}`} onClick={() => select(a)}>
                <span className="a-album-thumb">{a.photos[0] ? <img src={a.photos[0].url} alt="" /> : null}</span>
                <span className="a-album-text"><strong>{a.name}</strong><small>{a.photos.length} foto&apos;s{a.visible ? '' : ' · verborgen'}</small></span>
              </button>
            ))
          )}
        </div>
        <div className={`a-lib-detail ${draft ? 'a-card a-panel' : 'a-dashed'}`}>
          {!draft ? (
            <p className="a-muted a-center">Selecteer of maak een map om foto&apos;s te beheren.</p>
          ) : (
            <>
              <div className="a-fields">
                <label className="a-field"><span>Naam</span><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
                <label className="a-field"><span>Slug</span><input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></label>
                <label className="a-field a-field-wide"><span>Omschrijving (optioneel)</span><input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
              </div>
              <div className="a-shortcode">
                <span>Shortcode</span><code>{shortcode}</code>
                <button className="a-icon-btn" aria-label="Kopiëren" onClick={() => { navigator.clipboard?.writeText(shortcode); toast('Shortcode gekopieerd'); }}><Copy size={15} /></button>
                <small className="a-muted">Plak in &quot;Extra inhoud&quot; van een pagina. Zichtbare mappen staan automatisch op de fotopagina.</small>
              </div>
              <div className="a-row-actions">
                <button className="a-btn a-btn-primary" onClick={() => saveDraft()}><Save size={16} /> Opslaan</button>
                <button className="a-btn a-btn-outline" onClick={() => fileRef.current?.click()} disabled={!!progress}><ImagePlus size={16} /> {progress || "Foto's toevoegen"}</button>
                <button className="a-btn a-btn-outline" onClick={() => { const n = { ...draft, visible: !draft.visible }; setDraft(n); saveDraft(n); }}>
                  {draft.visible ? <><EyeOff size={16} /> Verbergen</> : <><Eye size={16} /> Tonen</>}
                </button>
                <button className="a-btn a-btn-ghost a-danger" onClick={removeAlbum}><Trash2 size={16} /> Map verwijderen</button>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
              </div>
              {draft.photos.length === 0 ? (
                <div className="a-dashed a-drop">Nog geen foto&apos;s in deze map.</div>
              ) : (
                <div className="a-photos">
                  {draft.photos.map((p) => (
                    <figure key={p.id} className="a-photo">
                      <img src={p.url} alt={p.alt} />
                      <input placeholder="Bijschrift" value={p.alt} onChange={(e) => setDraft({ ...draft, photos: draft.photos.map((x) => (x.id === p.id ? { ...x, alt: e.target.value } : x)) })} />
                      <button className="a-photo-del" aria-label="Foto verwijderen" onClick={() => removePhoto(p.id)}><Trash2 size={14} /></button>
                    </figure>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

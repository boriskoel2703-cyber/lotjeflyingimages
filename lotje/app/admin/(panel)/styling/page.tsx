'use client';
import { useEffect, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { Loading, useAdmin } from '@/components/admin/Provider';
import { COLOR_LABELS, DEFAULT_COLORS } from '@/lib/defaults';
import type { ColorKey, Colors } from '@/lib/types';

const HEX = /^#[0-9a-f]{6}$/i;

export default function Styling() {
  const { content, saveSection } = useAdmin();
  const [c, setC] = useState<Colors | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (content && !c) setC({ ...content.colors }); }, [content, c]);
  if (!content || !c) return <Loading />;
  const keys = Object.keys(COLOR_LABELS) as ColorKey[];
  const valid = keys.every((k) => HEX.test(c[k]));
  async function save() {
    setSaving(true);
    await saveSection('colors', c!);
    setSaving(false);
  }
  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-h1">Styling</h1>
          <p className="a-sub">Pas de kleuren van de website aan met kleurpickers. Sla op om ze live te zetten.</p>
        </div>
      </div>
      <div className="a-two">
        <section className="a-card a-panel">
          <h2 className="a-h2">Kleuren</h2>
          <p className="a-sub a-sub-sm">De huisstijl van Feestcafé Lotje.</p>
          <div className="a-colors">
            {keys.map((k) => (
              <div key={k} className="a-color-row">
                <label htmlFor={`c-${k}`}>{COLOR_LABELS[k]}</label>
                <input className={`a-hex ${HEX.test(c[k]) ? '' : 'invalid'}`} value={c[k]} onChange={(e) => setC({ ...c, [k]: e.target.value.trim() })} />
                <input id={`c-${k}`} type="color" className="a-swatch" value={HEX.test(c[k]) ? c[k] : '#000000'} onChange={(e) => setC({ ...c, [k]: e.target.value })} />
              </div>
            ))}
          </div>
          <div className="a-row-actions">
            <button className="a-btn a-btn-primary" onClick={save} disabled={saving || !valid}><Save size={17} /> {saving ? 'Opslaan…' : 'Kleuren opslaan'}</button>
            <button className="a-btn a-btn-outline" onClick={() => setC({ ...DEFAULT_COLORS })}><RotateCcw size={17} /> Standaard</button>
          </div>
        </section>
        <section className="a-card a-panel">
          <h2 className="a-h2">Voorbeeld</h2>
          <p className="a-sub a-sub-sm">Zo ziet de website er met deze kleuren uit.</p>
          <div className="a-swatches">
            {(['accent', 'accentLight', 'accentDark', 'cream', 'offwhite'] as ColorKey[]).map((k) => (
              <div key={k}><span style={{ background: c[k] }} /><code>{c[k]}</code></div>
            ))}
          </div>
          <div className="a-preview" style={{ background: c.bg, color: c.text, borderColor: c.surface }}>
            <p className="a-preview-eyebrow" style={{ color: c.accent }}>PLAN JE FEEST</p>
            <h3>Klaar voor jouw feest bij Lotje<span style={{ color: c.accent }}>?</span></h3>
            <p style={{ color: c.muted }}>De accentkleuren worden overal op de website gebruikt: buttons, labels, chips en meer.</p>
            <div className="a-row-actions">
              <span className="a-preview-btn" style={{ background: c.accent, color: c.bg }}>Plan je feest</span>
              <span className="a-preview-btn" style={{ border: `1px solid ${c.offwhite}40`, color: c.offwhite, background: c.surface }}>Bekijk agenda</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { BarChart3, Clock, Mail, MapPin, Plus, Save, Trash2 } from 'lucide-react';
import { Loading, useAdmin } from '@/components/admin/Provider';
import type { Settings } from '@/lib/types';

const TABS = [
  { key: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { key: 'contact', label: 'Contact', Icon: Mail },
  { key: 'adres', label: 'Adres', Icon: MapPin },
  { key: 'tijden', label: 'Openingstijden', Icon: Clock },
] as const;

export default function SettingsPage() {
  const { content, saveSection } = useAdmin();
  const [s, setS] = useState<Settings | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('analytics');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (content && !s) setS({ ...content.settings, hours: content.settings.hours.map((h) => ({ ...h })) }); }, [content, s]);
  if (!content || !s) return <Loading />;
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });
  const F = ({ k, label, help, placeholder }: { k: keyof Settings; label: string; help?: string; placeholder?: string }) => (
    <label className="a-field">
      <span>{label}</span>
      <input value={String(s[k] ?? '')} placeholder={placeholder} onChange={(e) => set(k, e.target.value as never)} />
      {help && <small>{help}</small>}
    </label>
  );
  async function save() {
    setSaving(true);
    await saveSection('settings', s!);
    setSaving(false);
  }
  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-h1">Instellingen</h1>
          <p className="a-sub">Analytics, contactgegevens, adres en openingstijden van Feestcafé Lotje.</p>
        </div>
        <button className="a-btn a-btn-primary" onClick={save} disabled={saving}><Save size={17} /> {saving ? 'Opslaan…' : 'Opslaan'}</button>
      </div>
      <div className="a-tabs" role="tablist">
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
            <Icon size={17} strokeWidth={1.6} /> {label}
          </button>
        ))}
      </div>
      <section className="a-card a-panel">
        {tab === 'analytics' && (
          <>
            <h2 className="a-h2">Google Analytics</h2>
            <p className="a-sub a-sub-sm">Koppel je Google Analytics 4 (GA4) property aan de website.</p>
            {F({ k: 'gaId', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX', help: 'Te vinden in Google Analytics onder Beheer → Dataverzameling → Data streams. Leeg laten om tracking uit te zetten.' })}
          </>
        )}
        {tab === 'contact' && (
          <>
            <h2 className="a-h2">Contactgegevens</h2>
            <p className="a-sub a-sub-sm">Worden getoond in de footer, op de contactpagina en in de knoppen.</p>
            <div className="a-fields">
              {F({ k: 'email', label: 'E-mailadres' })}
              {F({ k: 'phone', label: 'Telefoonnummer' })}
              {F({ k: 'instagram', label: 'Instagram-link', placeholder: 'https://instagram.com/…' })}
              {F({ k: 'facebook', label: 'Facebook-link', placeholder: 'https://facebook.com/…' })}
              {F({ k: 'tiktok', label: 'TikTok-link', placeholder: 'https://tiktok.com/@…' })}
              {F({ k: 'creditLabel', label: 'Credit in footer (tekst)', help: 'Leeg laten om te verbergen.' })}
              {F({ k: 'creditUrl', label: 'Credit in footer (link)' })}
            </div>
          </>
        )}
        {tab === 'adres' && (
          <>
            <h2 className="a-h2">Adres</h2>
            <p className="a-sub a-sub-sm">Laat straat leeg als je alleen de plaats wilt tonen.</p>
            <div className="a-fields">
              {F({ k: 'street', label: 'Straat + huisnummer' })}
              {F({ k: 'postcode', label: 'Postcode' })}
              {F({ k: 'city', label: 'Plaats' })}
              {F({ k: 'region', label: 'Provincie' })}
              {F({ k: 'mapsUrl', label: 'Google Maps-link', placeholder: 'https://maps.app.goo.gl/…' })}
            </div>
          </>
        )}
        {tab === 'tijden' && (
          <>
            <h2 className="a-h2">Openingstijden</h2>
            <p className="a-sub a-sub-sm">Bijvoorbeeld &quot;Vr – za&quot; en &quot;15:00 – 03:00&quot;.</p>
            <div className="a-hours">
              {s.hours.map((h, i) => (
                <div key={i} className="a-hours-row">
                  <input value={h.label} placeholder="Dag(en)" onChange={(e) => set('hours', s.hours.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                  <input value={h.value} placeholder="Tijden of Gesloten" onChange={(e) => set('hours', s.hours.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                  <button className="a-icon-btn" aria-label="Regel verwijderen" onClick={() => set('hours', s.hours.filter((_, j) => j !== i))}><Trash2 size={16} /></button>
                </div>
              ))}
              <button className="a-btn a-btn-outline" onClick={() => set('hours', [...s.hours, { label: '', value: '' }])}><Plus size={16} /> Regel toevoegen</button>
            </div>
          </>
        )}
      </section>
    </>
  );
}

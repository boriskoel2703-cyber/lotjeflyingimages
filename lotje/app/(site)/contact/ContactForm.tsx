'use client';
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

const TYPES = [
  { key: 'Feest', text: 'Verjaardag, jubileum of eigen feest' },
  { key: 'Borrel', text: 'Bedrijfsborrel of gezellig samenzijn' },
  { key: 'Anders', text: 'Iets anders — we horen het graag' },
];

export function ContactForm({ note, success }: { note: string; success: string }) {
  const [type, setType] = useState('Feest');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type }),
    }).catch(() => null);
    if (res?.ok) setState('done');
    else {
      setState('error');
      setError((await res?.json().catch(() => null))?.error || 'Versturen lukte niet. Probeer het opnieuw of bel ons even.');
    }
  }

  if (state === 'done') {
    return (
      <div className="form-success">
        <span className="icon-circle icon-circle-lg"><Check size={18} /></span>
        <p className="lead">{success}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <p className="label accent">Waar gaat het om?</p>
      <div className="type-cards" role="radiogroup">
        {TYPES.map((t) => (
          <button type="button" role="radio" aria-checked={type === t.key} key={t.key} className={`type-card ${type === t.key ? 'active' : ''}`} onClick={() => setType(t.key)}>
            <strong>{t.key}</strong>
            <span>{t.text}</span>
          </button>
        ))}
      </div>
      <label className="field"><span className="label">Naam</span><input name="name" required placeholder="Voor- en achternaam" autoComplete="name" /></label>
      <label className="field"><span className="label">E-mailadres</span><input name="email" type="email" required placeholder="naam@voorbeeld.nl" autoComplete="email" /></label>
      <div className="field-row">
        <label className="field"><span className="label">Telefoonnummer</span><input name="phone" type="tel" placeholder="06 12 34 56 78" autoComplete="tel" /></label>
        <label className="field"><span className="label">Aantal gasten</span><input name="guests" inputMode="numeric" placeholder="bijv. 60" /></label>
      </div>
      <label className="field"><span className="label">Gewenste datum</span><input name="date" type="date" /></label>
      <label className="field"><span className="label">Jouw idee</span><textarea name="message" rows={6} placeholder="Wat heb je in gedachten? Denk aan muziek, thema, catering, decoratie..." /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      <div className="form-actions">
        <button className="btn btn-accent btn-lg" disabled={state === 'sending'}>
          <Mail size={15} strokeWidth={1.8} /> {state === 'sending' ? 'Versturen…' : 'Verstuur aanvraag'}
        </button>
        <p className="form-note">{note}</p>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

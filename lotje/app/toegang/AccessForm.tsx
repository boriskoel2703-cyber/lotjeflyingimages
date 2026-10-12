'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Logo } from '@/components/site/Logo';

export function AccessForm() {
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const password = new FormData(e.currentTarget).get('password');
    const r = await fetch('/api/toegang', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (r.ok) {
      const naar = params.get('naar') || '/';
      window.location.href = naar.startsWith('/') && !naar.startsWith('//') ? naar : '/';
    } else {
      setError((await r.json().catch(() => ({}))).error || 'Onjuist wachtwoord.');
      setBusy(false);
    }
  }
  return (
    <div className="a-login">
      <div className="a-login-logo"><Logo size="lg" /></div>
      <form className="a-card a-login-card" onSubmit={submit}>
        <h1 className="a-h1">Binnenkort online</h1>
        <p className="a-sub">De nieuwe website van Feestcafé Lotje is nog in ontwikkeling. Voer het wachtwoord in om een kijkje te nemen.</p>
        <label className="a-field"><span>Wachtwoord</span><input name="password" type="password" required autoFocus autoComplete="current-password" /></label>
        {error && <p className="a-error">{error}</p>}
        <button className="a-btn a-btn-primary a-btn-block" disabled={busy}><Lock size={17} /> {busy ? 'Bezig…' : 'Bekijk website'}</button>
      </form>
    </div>
  );
}

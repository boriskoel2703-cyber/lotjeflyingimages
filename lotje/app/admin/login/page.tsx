'use client';
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { Logo } from '@/components/site/Logo';

export default function Login() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (r.ok) window.location.href = '/admin';
    else {
      setError((await r.json().catch(() => ({}))).error || 'Inloggen mislukt');
      setBusy(false);
    }
  }
  return (
    <div className="a-login">
      <div className="a-login-logo"><Logo size="lg" /></div>
      <form className="a-card a-login-card" onSubmit={submit}>
        <h1 className="a-h1">Inloggen</h1>
        <p className="a-sub">Website beheer van Feestcafé Lotje.</p>
        <label className="a-field"><span>E-mailadres</span><input name="email" type="email" required autoComplete="username" defaultValue="" /></label>
        <label className="a-field"><span>Wachtwoord</span><input name="password" type="password" required autoComplete="current-password" /></label>
        {error && <p className="a-error">{error}</p>}
        <button className="a-btn a-btn-primary a-btn-block" disabled={busy}><LogIn size={17} /> {busy ? 'Bezig…' : 'Inloggen'}</button>
      </form>
    </div>
  );
}

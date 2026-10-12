'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Content, PageFields, PageKey, SectionKey } from '@/lib/types';

type Ctx = {
  content: Content | null;
  error: string;
  saveSection: <K extends SectionKey>(section: K, value: Content[K]) => Promise<boolean>;
  savePage: (page: PageKey, value: PageFields) => Promise<boolean>;
  toast: (msg: string, kind?: 'ok' | 'err') => void;
};

const AdminCtx = createContext<Ctx | null>(null);
export const useAdmin = () => {
  const c = useContext(AdminCtx);
  if (!c) throw new Error('useAdmin buiten provider');
  return c;
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null);

  useEffect(() => {
    fetch('/api/admin/content', { cache: 'no-store' })
      .then(async (r) => {
        if (r.status === 401) { window.location.href = '/admin/login'; return; }
        if (!r.ok) throw new Error('Laden mislukt');
        setContent(await r.json());
      })
      .catch((e) => setError(e.message));
  }, []);

  const toast = useCallback((text: string, kind: 'ok' | 'err' = 'ok') => {
    setMsg({ text, kind });
    window.setTimeout(() => setMsg(null), kind === 'err' ? 7000 : 2600);
  }, []);

  const put = useCallback(async (body: object) => {
    const r = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { toast(data.error || 'Opslaan mislukt', 'err'); return false; }
    setContent(data);
    toast('Opgeslagen');
    return true;
  }, [toast]);

  const saveSection: Ctx['saveSection'] = useCallback((section, value) => put({ section, value }), [put]);
  const savePage: Ctx['savePage'] = useCallback((page, value) => put({ page, value }), [put]);

  return (
    <AdminCtx.Provider value={{ content, error, saveSection, savePage, toast }}>
      {children}
      {msg && <div className={`toast toast-${msg.kind}`} role="status">{msg.text}</div>}
    </AdminCtx.Provider>
  );
}

export function Loading() {
  const { error } = useAdmin();
  return <div className="a-loading">{error || 'Laden…'}</div>;
}

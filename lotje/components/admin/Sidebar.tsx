'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CalendarDays, FileText, Images, Inbox, LayoutGrid, LogOut, Menu, Palette, Settings, X } from 'lucide-react';
import { Logo } from '@/components/site/Logo';

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutGrid },
  { href: '/admin/paginas', label: "Pagina's", Icon: FileText },
  { href: '/admin/styling', label: 'Styling', Icon: Palette },
  { href: '/admin/instellingen', label: 'Instellingen', Icon: Settings },
  { href: '/admin/evenementen', label: 'Evenementen', Icon: CalendarDays },
  { href: '/admin/fotobibliotheek', label: 'Fotobibliotheek', Icon: Images },
  { href: '/admin/aanvragen', label: 'Aanvragen', Icon: Inbox },
];

export function Sidebar({ email }: { email: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }
  return (
    <>
      <button className="a-menu" onClick={() => setOpen(true)} aria-label="Menu openen"><Menu size={20} /></button>
      <aside className={`a-side ${open ? 'open' : ''}`}>
        <div className="a-side-logo">
          <Link href="/admin" onClick={() => setOpen(false)}><Logo /></Link>
          <button className="a-side-close" onClick={() => setOpen(false)} aria-label="Sluiten"><X size={20} /></button>
        </div>
        <nav className="a-nav">
          {NAV.map(({ href, label, Icon }) => {
            const active = href === '/admin' ? path === '/admin' : path.startsWith(href);
            return (
              <Link key={href} href={href} className={`a-nav-link ${active ? 'active' : ''}`} onClick={() => setOpen(false)}>
                <Icon size={18} strokeWidth={1.6} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="a-user">
          <strong>Lotje Admin</strong>
          <span>{email}</span>
          <button onClick={logout} className="a-logout"><LogOut size={17} strokeWidth={1.6} /> Uitloggen</button>
        </div>
      </aside>
      {open && <div className="a-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}

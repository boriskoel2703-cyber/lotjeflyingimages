'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Ticket, X } from 'lucide-react';
import { Logo } from './Logo';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/evenementen', label: 'Evenementen' },
  { href: '/fotos', label: 'Fotos' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  const isHome = path === '/';
  return (
    <header className={`site-header ${scrolled || !isHome ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="header-logo"><Logo /></Link>
        <nav className="main-nav" aria-label="Hoofdmenu">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`nav-link ${path === n.href ? 'active' : ''}`}>
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-accent btn-sm nav-cta">
            <Ticket size={15} strokeWidth={1.8} /> Plan je feest
          </Link>
        </nav>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

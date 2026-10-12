import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { SocialLinks } from './Social';
import { Hours } from './Hours';
import { telHref } from '@/lib/util';
import type { Settings } from '@/lib/types';

export function Footer({ s }: { s: Settings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo size="lg" />
            <p className="footer-tag">Feestcafé in het hart van {s.city}. Jouw feest, ons podium — elke week weer.</p>
            <ul className="footer-contact">
              <li>
                <MapPin size={15} />
                {s.mapsUrl ? <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer">{[s.street, s.city].filter(Boolean).join(', ')}</a> : <span>{[s.street, s.city].filter(Boolean).join(', ')}</span>}
              </li>
              <li><Mail size={15} /><a href={`mailto:${s.email}`}>{s.email}</a></li>
              <li><Phone size={15} /><a href={telHref(s.phone)}>{s.phone}</a></li>
            </ul>
          </div>
          <div>
            <p className="label accent">Navigatie</p>
            <ul className="footer-nav">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/evenementen">Evenementen</Link></li>
              <li><Link href="/fotos">Fotos</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="label accent">Openingstijden</p>
            <Hours rows={s.hours} compact />
          </div>
          <div>
            <p className="label accent">Volg ons</p>
            <SocialLinks s={s} />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Feestcafé Lotje — {s.city}</span>
          {s.creditLabel && (
            <span>
              Website door{' '}
              <a href={s.creditUrl || '#'} target="_blank" rel="noopener noreferrer" className="credit">{s.creditLabel}</a>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

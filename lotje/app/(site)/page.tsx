import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight, CalendarDays, Clock, Headphones, Mail, Martini, Mic, Music, Phone, Sparkles, Star, Store, Ticket, Users,
} from 'lucide-react';
import { getContent } from '@/lib/store';
import { Rich } from '@/components/site/Rich';
import { EventCard } from '@/components/site/EventCard';
import { Body } from '@/components/site/Body';
import { lines, paragraphs, telHref, todayISO } from '@/lib/util';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getContent();
  return { title: { absolute: 'Feestcafé Lotje — Zeewolde' }, description: pages.home.metaDescription };
}

const STAT_ICONS = [Users, Clock, Sparkles];
const TILE_ICONS = [Martini, Sparkles, Music, Mic, Star, Store];
const SERVICE_ICONS = [Store, Headphones, Martini];

function Stars() {
  const pos = [
    [26, 14], [21, 22], [33, 4], [41, 4], [49, 25], [72, 41], [92, 4], [96, 29], [13, 38], [22, 64], [88, 70],
  ];
  return (
    <div className="hero-stars" aria-hidden>
      {pos.map(([x, y], i) => (
        <span key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i % 5) * 0.7}s`, fontSize: i % 3 === 0 ? 14 : 9 }}>✦</span>
      ))}
    </div>
  );
}

function Badge({ city }: { city: string }) {
  const text = `FEESTCAFÉ LOTJE • ${city.toUpperCase()} • FEESTCAFÉ LOTJE • ${city.toUpperCase()} • `;
  return (
    <div className="hero-badge" aria-hidden>
      <svg viewBox="0 0 120 120">
        <defs>
          <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text><textPath href="#badge-circle" textLength="289">{text}</textPath></text>
      </svg>
      <span className="hero-badge-star">✦</span>
    </div>
  );
}

export default async function Home() {
  const { pages, events, settings, albums } = await getContent();
  const p = pages.home;
  const today = todayISO();
  const upcoming = events
    .filter((e) => e.status === 'gepubliceerd' && e.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3);
  const marquee = lines(p.marquee);
  const stats = lines(p.stats).map((l) => l.split('|').map((x) => x.trim()));
  const tiles = lines(p.tiles).slice(0, 6);
  const services = [1, 2, 3].map((n) => ({ title: p[`s${n}Title`], text: p[`s${n}Text`], items: lines(p[`s${n}Items`]) }));

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={p.heroImage ? { backgroundImage: `url(${p.heroImage})` } : undefined} />
        <div className="hero-shade" />
        <Stars />
        <div className="container hero-inner">
          <div className="hero-top">
            <span className="chip chip-outline">{p.heroChip}</span>
            <span className="label hero-loc">— {p.heroLocation}</span>
          </div>
          <h1 className="display hero-title">
            <span className="hero-line"><Rich text={p.title} /></span>
            <span className="hero-line"><Rich text={p.title2} /></span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-text">{p.heroText}</p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-accent"><Ticket size={15} strokeWidth={1.8} /> Plan je feest</Link>
              <Link href="/evenementen" className="btn btn-ghost"><CalendarDays size={15} strokeWidth={1.8} /> Bekijk agenda</Link>
            </div>
            <Badge city={settings.city} />
          </div>
        </div>
        {marquee.length > 0 && (
          <div className="marquee" aria-label={marquee.join(', ')}>
            <div className="marquee-track">
              {[0, 1, 2].map((k) => (
                <div className="marquee-set" key={k} aria-hidden={k > 0}>
                  {marquee.map((m, i) => (
                    <span key={i} className="marquee-item">{m}<span className="marquee-star">✦</span></span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* HET CAFÉ */}
      <section className="section">
        <div className="container">
          <div className="eyebrow"><span>{p.cafeEyebrow}</span></div>
          <div className="cafe-grid">
            <div className="cafe-left">
              <h2 className="display h2"><Rich text={p.cafeTitle} /></h2>
              {paragraphs(p.cafeText).map((t, i) => <p key={i} className="muted body-p">{t}</p>)}
            </div>
            <div className="cafe-right">
              <p className="lead">{p.cafeLead}</p>
              <ul className="stats">
                {stats.map(([value, label], i) => {
                  const Icon = STAT_ICONS[i % STAT_ICONS.length];
                  return (
                    <li key={i}>
                      <span className="icon-circle"><Icon size={14} strokeWidth={1.6} /></span>
                      <strong className="stat-value">{value}</strong>
                      <span className="label stat-label">{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {tiles.length > 0 && (
            <div className="tiles">
              {tiles.map((t, i) => {
                const Icon = TILE_ICONS[i % TILE_ICONS.length];
                return (
                  <div key={i} className="tile">
                    <span className="icon-circle icon-circle-lg"><Icon size={17} strokeWidth={1.5} /></span>
                    <span className="label">{t}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* AGENDA */}
      <section className="section section-alt">
        <div className="container">
          <div className="eyebrow"><span>{p.agendaEyebrow}</span></div>
          <div className="section-head">
            <h2 className="display h2 narrow"><Rich text={p.agendaTitle} /></h2>
            <Link href="/evenementen" className="link-arrow">Alle events <ArrowRight size={14} /></Link>
          </div>
          {upcoming.length ? (
            <div className="events-grid">{upcoming.map((e) => <EventCard key={e.id} e={e} />)}</div>
          ) : (
            <p className="muted agenda-empty">{p.agendaEmpty}</p>
          )}
        </div>
      </section>

      {/* JOUW FEEST */}
      <section className="section">
        <div className="container">
          <div className="eyebrow"><span>{p.servicesEyebrow}</span></div>
          <div className="section-head services-head">
            <h2 className="display h2"><Rich text={p.servicesTitle} /></h2>
            <p className="muted services-text">{p.servicesText}</p>
          </div>
          <div className="services">
            {services.map((s, i) => {
              const Icon = SERVICE_ICONS[i];
              return (
                <div key={i} className="service">
                  <span className="icon-square"><Icon size={18} strokeWidth={1.5} /></span>
                  <h3 className="h3">{s.title}</h3>
                  <p className="muted">{s.text}</p>
                  <ul className="star-list">
                    {s.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
          {p.body && <Body text={p.body} albums={albums} />}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-bg" style={p.ctaImage ? { backgroundImage: `url(${p.ctaImage})` } : undefined} />
        <div className="cta-shade" />
        <div className="container cta-inner">
          <span className="chip chip-outline">{p.ctaChip}</span>
          <h2 className="display cta-title"><Rich text={p.ctaTitle} /></h2>
          <p className="cta-text">{p.ctaText}</p>
          <div className="cta-actions">
            <a href={`mailto:${settings.email}`} className="btn btn-cream"><Mail size={15} strokeWidth={1.8} /> Stuur een mailtje</a>
            <a href={telHref(settings.phone)} className="btn btn-ghost"><Phone size={15} strokeWidth={1.8} /> Bel {settings.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}

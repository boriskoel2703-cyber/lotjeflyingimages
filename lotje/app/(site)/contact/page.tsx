import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { getContent } from '@/lib/store';
import { PageHero } from '@/components/site/PageHero';
import { plain } from '@/components/site/Rich';
import { Hours } from '@/components/site/Hours';
import { SocialLinks } from '@/components/site/Social';
import { Body } from '@/components/site/Body';
import { ContactForm } from './ContactForm';
import { telHref } from '@/lib/util';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getContent();
  return { title: plain(pages.contact.eyebrow), description: pages.contact.metaDescription };
}

export default async function ContactPage() {
  const { pages, settings: s, albums } = await getContent();
  const p = pages.contact;
  const address = [s.street, [s.postcode, s.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  const cards = [
    { Icon: Mail, label: 'Mail ons', value: s.email, href: `mailto:${s.email}` },
    { Icon: Phone, label: 'Bel ons', value: s.phone, href: telHref(s.phone) },
    { Icon: MapPin, label: 'Vind ons', value: address || s.city, href: s.mapsUrl || undefined },
  ];
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <section className="section">
        <div className="container contact-grid">
          <ContactForm note={p.formNote} success={p.successText} />
          <aside className="contact-side">
            {cards.map(({ Icon, label, value, href }) => {
              const inner = (
                <>
                  <span className="icon-circle icon-circle-lg"><Icon size={17} strokeWidth={1.5} /></span>
                  <span>
                    <span className="label">{label}</span>
                    <span className="contact-card-value">{value}</span>
                  </span>
                </>
              );
              return href ? (
                <a key={label} href={href} className="contact-card" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={label} className="contact-card">{inner}</div>
              );
            })}
            <p className="label accent side-label">Openingstijden</p>
            <Hours rows={s.hours} />
            <p className="label accent side-label">Volg ons</p>
            <SocialLinks s={s} />
          </aside>
        </div>
        {p.body && <div className="container"><Body text={p.body} albums={albums} /></div>}
      </section>
    </>
  );
}

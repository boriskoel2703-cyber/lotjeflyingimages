import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { getContent } from '@/lib/store';
import { PageHero } from '@/components/site/PageHero';
import { plain } from '@/components/site/Rich';
import { Body } from '@/components/site/Body';
import { EventsFilter } from './EventsFilter';
import { todayISO } from '@/lib/util';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getContent();
  return { title: plain(pages.evenementen.eyebrow), description: pages.evenementen.metaDescription };
}

export default async function EventsPage() {
  const { pages, events, albums } = await getContent();
  const p = pages.evenementen;
  const today = todayISO();
  const list = events
    .filter((e) => e.status === 'gepubliceerd' && e.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <section className="section">
        <div className="container">
          <EventsFilter events={list} emptyText={p.empty} />
          {p.footnote && (
            <p className="footnote">
              {p.footnote} <Link href="/contact" className="text-link">onze contactpagina</Link> <ArrowRight size={13} className="accent" />.
            </p>
          )}
          {p.body && <Body text={p.body} albums={albums} />}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { getContent } from '@/lib/store';
import { PageHero } from '@/components/site/PageHero';
import { plain } from '@/components/site/Rich';
import { Body, EmptyState } from '@/components/site/Body';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getContent();
  return { title: plain(pages.fotos.eyebrow), description: pages.fotos.metaDescription };
}

export default async function PhotosPage() {
  const { pages, albums } = await getContent();
  const p = pages.fotos;
  const body = p.body?.trim() ? p.body : '[albums]';
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <section className="section">
        <div className="container">
          {albums.some((a) => a.visible && a.photos.length) || !/^\s*\[albums\]\s*$/i.test(body) ? (
            <Body text={body} albums={albums} emptyText={p.empty} />
          ) : (
            <EmptyState text={p.empty} />
          )}
        </div>
      </section>
    </>
  );
}

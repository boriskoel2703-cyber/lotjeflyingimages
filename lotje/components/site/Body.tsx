import { Sparkles } from 'lucide-react';
import { Gallery } from './Gallery';
import { paragraphs } from '@/lib/util';
import type { Album } from '@/lib/types';

function AlbumBlock({ a }: { a: Album }) {
  return (
    <div className="album-block">
      <div className="album-head">
        <h2 className="h3">{a.name}</h2>
        {a.description && <p className="muted">{a.description}</p>}
      </div>
      <Gallery photos={a.photos} />
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="empty-box">
      <Sparkles size={26} strokeWidth={1.5} className="accent" />
      <p>{text}</p>
    </div>
  );
}

/** Rendert vrije tekst met shortcodes [album slug] en [albums]. */
export function Body({ text, albums, emptyText }: { text: string; albums: Album[]; emptyText?: string }) {
  const visible = albums.filter((a) => a.visible && a.photos.length);
  const blocks = paragraphs(text);
  if (!blocks.length) return null;
  return (
    <div className="body-content">
      {blocks.map((b, i) => {
        const all = b.match(/^\[albums\]$/i);
        if (all) return visible.length ? visible.map((a) => <AlbumBlock key={a.id} a={a} />) : emptyText ? <EmptyState key={i} text={emptyText} /> : null;
        const one = b.match(/^\[album[:\s]+([a-z0-9-]+)\]$/i);
        if (one) {
          const a = albums.find((x) => x.slug === one[1].toLowerCase() && x.photos.length);
          return a ? <AlbumBlock key={i} a={a} /> : null;
        }
        return <p key={i} className="prose-p">{b}</p>;
      })}
    </div>
  );
}

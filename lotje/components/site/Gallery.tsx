'use client';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Photo } from '@/lib/types';

export function Gallery({ photos }: { photos: Photo[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  const go = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);
  useEffect(() => {
    if (idx === null) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIdx(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', on);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', on);
      document.body.style.overflow = '';
    };
  }, [idx, go]);
  return (
    <>
      <div className="gallery">
        {photos.map((p, i) => (
          <button key={p.id} className="gallery-item" onClick={() => setIdx(i)} aria-label={p.alt || 'Foto openen'}>
            <img src={p.url} alt={p.alt} loading="lazy" />
          </button>
        ))}
      </div>
      {idx !== null && photos[idx] && (
        <div className="lightbox" role="dialog" aria-modal onClick={() => setIdx(null)}>
          <button className="lb-btn lb-close" aria-label="Sluiten"><X /></button>
          {photos.length > 1 && (
            <>
              <button className="lb-btn lb-prev" aria-label="Vorige" onClick={(e) => { e.stopPropagation(); go(-1); }}><ChevronLeft /></button>
              <button className="lb-btn lb-next" aria-label="Volgende" onClick={(e) => { e.stopPropagation(); go(1); }}><ChevronRight /></button>
            </>
          )}
          <img src={photos[idx].url} alt={photos[idx].alt} onClick={(e) => e.stopPropagation()} />
          {photos[idx].alt && <p className="lb-caption">{photos[idx].alt}</p>}
        </div>
      )}
    </>
  );
}

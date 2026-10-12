'use client';
import { useState } from 'react';
import { EventCard } from '@/components/site/EventCard';
import type { EventItem } from '@/lib/types';

const FILTERS = [
  { key: 'all', label: 'Alles' },
  { key: 'live', label: 'Live' },
  { key: 'dj', label: 'DJ' },
  { key: 'feest', label: 'Feest' },
  { key: 'quiz', label: 'Quiz' },
];

export function EventsFilter({ events, emptyText }: { events: EventItem[]; emptyText: string }) {
  const [f, setF] = useState('all');
  const shown = f === 'all' ? events : events.filter((e) => e.category === f);
  return (
    <>
      <div className="filters" role="tablist">
        {FILTERS.map((x) => (
          <button key={x.key} role="tab" aria-selected={f === x.key} className={`filter ${f === x.key ? 'active' : ''}`} onClick={() => setF(x.key)}>
            {x.label}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="events-grid">{shown.map((e) => <EventCard key={e.id} e={e} />)}</div>
      ) : (
        <p className="muted events-empty">{events.length ? 'Geen evenementen in deze categorie.' : emptyText}</p>
      )}
    </>
  );
}

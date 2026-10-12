import { Clock } from 'lucide-react';
import { CATEGORY_LABELS, dateParts } from '@/lib/util';
import type { EventItem } from '@/lib/types';

export function EventCard({ e }: { e: EventItem }) {
  const d = dateParts(e.date);
  return (
    <article className="event-card">
      <div className="event-media">
        {e.image ? <img src={e.image} alt={e.title} loading="lazy" /> : <div className="event-media-fallback" aria-hidden>✦</div>}
        <div className="event-date">
          <span className="event-day">{d.day}</span>
          <span className="event-month">{d.month}</span>
        </div>
      </div>
      <div className="event-body">
        <div className="event-meta">
          <span className="chip chip-accent">{CATEGORY_LABELS[e.category] || e.category}</span>
          <span className="event-when"><Clock size={13} /> {d.weekday} {e.time}</span>
        </div>
        <h3 className="event-title">{e.title}</h3>
        {e.description && <p className="event-desc">{e.description}</p>}
      </div>
    </article>
  );
}

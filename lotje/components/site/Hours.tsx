import type { HoursRow } from '@/lib/types';
export function Hours({ rows, compact }: { rows: HoursRow[]; compact?: boolean }) {
  return (
    <dl className={`hours ${compact ? 'hours-compact' : ''}`}>
      {rows.map((r, i) => (
        <div key={i} className="hours-row">
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

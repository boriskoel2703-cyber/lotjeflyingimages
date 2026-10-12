import { Fragment } from 'react';

/** "*Ons* podium." → schuine serif voor *woord*, laatste . ? ! in accentkleur. */
export function Rich({ text, accentEnd = true }: { text: string; accentEnd?: boolean }) {
  let body = text || '';
  let end = '';
  if (accentEnd && /[.?!]$/.test(body)) {
    end = body.slice(-1);
    body = body.slice(0, -1);
  }
  const parts = body.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} className="serif">{p.slice(1, -1)}</em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
      {end && <span className="dot">{end}</span>}
    </>
  );
}

export const plain = (t: string) => (t || '').replace(/\*/g, '');

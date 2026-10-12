'use client';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { Loading, useAdmin } from '@/components/admin/Provider';
import { PAGE_LABELS } from '@/lib/defaults';
import { formatNL } from '@/lib/util';
import type { PageKey } from '@/lib/types';

export default function Pages() {
  const { content } = useAdmin();
  if (!content) return <Loading />;
  const keys = (Object.keys(content.pages) as PageKey[]).sort();
  return (
    <>
      <div className="a-head">
        <div>
          <h1 className="a-h1">Pagina&apos;s</h1>
          <p className="a-sub">Bewerk de teksten van de website. Wijzigingen zijn direct zichtbaar op de site.</p>
        </div>
      </div>
      <div className="a-card a-table-wrap">
        <table className="a-table">
          <thead><tr><th>Pagina</th><th>Titel</th><th>Laatst bijgewerkt</th><th className="a-right">Acties</th></tr></thead>
          <tbody>
            {keys.map((k) => {
              const p = content.pages[k];
              const title = [p.title, p.title2].filter(Boolean).join(' ').replace(/\*/g, '');
              return (
                <tr key={k}>
                  <td><span className="a-pill">{PAGE_LABELS[k]}</span></td>
                  <td>{title}</td>
                  <td className="a-muted">{formatNL(p._updatedAt)}</td>
                  <td className="a-right"><Link href={`/admin/paginas/${k}`} className="a-action"><Pencil size={16} /> Bewerken</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AccessForm } from './AccessForm';
import '../admin/admin.css';

export const metadata: Metadata = { title: 'Binnenkort online', robots: { index: false, follow: false } };

export default function Toegang() {
  return (
    <div className="admin">
      <Suspense>
        <AccessForm />
      </Suspense>
    </div>
  );
}

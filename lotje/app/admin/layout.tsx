import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = { title: 'Website beheer', robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="admin">{children}</div>;
}

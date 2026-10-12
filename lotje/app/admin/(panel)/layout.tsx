import { cookies } from 'next/headers';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminProvider } from '@/components/admin/Provider';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const email = (await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) || '';
  return (
    <AdminProvider>
      <div className="a-shell">
        <Sidebar email={email} />
        <div className="a-main">
          <header className="a-top">
            <span>Website beheer</span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="a-top-link">Bekijk website →</a>
          </header>
          <main className="a-content">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}

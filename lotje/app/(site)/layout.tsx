import Script from 'next/script';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { getContent } from '@/lib/store';

export const dynamic = 'force-dynamic';

const hexOk = (v: string) => /^#[0-9a-f]{3,8}$/i.test(v);

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { colors: c, settings } = await getContent();
  const v = (k: keyof typeof c, fallback: string) => (hexOk(c[k]) ? c[k] : fallback);
  const css = `:root{--accent:${v('accent', '#8b914c')};--accent-light:${v('accentLight', '#a3ab62')};--accent-dark:${v('accentDark', '#4c522d')};--cream:${v('cream', '#e9dcc0')};--offwhite:${v('offwhite', '#f3edde')};--bg:${v('bg', '#12110c')};--bg-2:${v('bg2', '#191812')};--surface:${v('surface', '#1c1b14')};--text:${v('text', '#f3edde')};--muted:${v('muted', '#a8a491')};}`;
  const ga = /^G-[A-Z0-9]+$/i.test(settings.gaId) ? settings.gaId : '';
  return (
    <div className="site">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script>
        </>
      )}
      <Header />
      <main>{children}</main>
      <Footer s={settings} />
    </div>
  );
}

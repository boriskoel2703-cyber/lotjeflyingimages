import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/inter';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/playfair-display/500-italic.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Feestcafé Lotje — Zeewolde', template: '%s — Feestcafé Lotje' },
  description: "Feestcafé Lotje in Zeewolde — jouw feest, ons podium. Zaal huren, live muziek, dj's en een bar die de hele avond doorstroomt.",
};

export const viewport: Viewport = { themeColor: '#12110c', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}

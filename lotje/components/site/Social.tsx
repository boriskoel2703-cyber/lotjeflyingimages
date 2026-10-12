// Merkiconen (lucide bevat geen merklogo's meer)
type P = { size?: number };
export const InstagramIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
export const FacebookIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
  </svg>
);
export const TiktokIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.6 3c.4 2.3 1.9 3.9 4.4 4.1v3.3c-1.6.1-3-.4-4.4-1.3v6.1c0 3.9-3 6.3-6.3 6.3A6.2 6.2 0 0 1 4 15.3c0-3.8 3.3-6.6 7.2-6v3.5c-1.8-.4-3.6.6-3.6 2.5 0 1.6 1.2 2.8 2.7 2.8 1.6 0 2.8-1 2.8-3V3z" />
  </svg>
);

export function SocialLinks({ s }: { s: { instagram: string; facebook: string; tiktok: string } }) {
  const items = [
    { href: s.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: s.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: s.tiktok, label: 'TikTok', Icon: TiktokIcon },
  ];
  return (
    <div className="socials">
      {items.map(({ href, label, Icon }) => (
        <a key={label} href={href || '#'} target={href ? '_blank' : undefined} rel="noopener noreferrer" aria-label={label} className="social-btn">
          <Icon />
        </a>
      ))}
    </div>
  );
}

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`logo logo-${size}`} aria-label="Lotje Zeewolde">
      Lotje<span className="logo-dot">.</span>
      <span className="logo-sub">Zeewolde</span>
    </span>
  );
}

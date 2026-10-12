import { Rich } from './Rich';

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow"><span>{eyebrow}</span></div>
        <h1 className="display page-title"><Rich text={title} /></h1>
        {intro && <p className="page-intro">{intro}</p>}
      </div>
    </section>
  );
}

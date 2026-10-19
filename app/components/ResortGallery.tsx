import { useState } from "react";
import type { ResortPhoto } from "../lib/resort-photos";
export function ResortGallery({ photos, resortName, quoteHref }: { photos: ResortPhoto[]; resortName: string; quoteHref: string }) {
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState<number | null>(null);
  if (!photos.length) return null;
  const categories = Array.from(new Set(photos.map(p => p.category)));
  const visible = category === "all" ? photos : photos.filter(p => p.category === category);
  const current = active === null ? null : visible[active];
  return <section className="property-details resort-gallery" aria-label={`${resortName} photo gallery`}>
    <div className="section-heading section-heading-stack"><p className="eyebrow">Explore the resort</p><h2>{resortName} photo gallery</h2><p>Browse official resort photography by experience. Room layouts and amenities may vary.</p></div>
    <div className="resort-gallery-filters"><button type="button" aria-pressed={category === "all"} onClick={() => { setCategory("all"); setActive(null); }}>All photos</button>{categories.map(c => <button key={c} type="button" aria-pressed={category === c} onClick={() => { setCategory(c); setActive(null); }}>{c}</button>)}</div>
    <div className="resort-gallery-grid">{visible.map((p,i) => <button type="button" key={p.key} onClick={() => setActive(i)} aria-label={`View ${p.alt}`}><img src={p.url} alt={p.alt} loading="lazy" decoding="async" /></button>)}</div>
    <div className="hero-actions"><a className="button button-primary" href={quoteHref}>Get My Personalized Resort Quote</a></div>
    {current && <div className="resort-gallery-lightbox" role="presentation" onClick={() => setActive(null)}><div role="dialog" aria-modal="true" aria-label={`${resortName} photo`} onClick={e => e.stopPropagation()} onKeyDown={e => { if(e.key === "Escape") setActive(null); }}><button type="button" aria-label="Close gallery" onClick={() => setActive(null)}>×</button><img src={current.url} alt={current.alt}/><p>{current.alt}</p><nav><button type="button" onClick={() => setActive((active! + visible.length - 1) % visible.length)}>Previous</button><span>{active! + 1} / {visible.length}</span><button type="button" onClick={() => setActive((active! + 1) % visible.length)}>Next</button></nav></div></div>}
  </section>;
}

import { journalPosts } from "../lib/property-data";

export function meta() {
  return [
    { title: "Travel Journal | Premier Resort Travel" },
    {
      name: "description",
      content:
        "Read Premier Resort Travel planning notes for couples escapes, family resort trips, and European hotel stays.",
    },
  ];
}

export default function JournalIndexPage() {
  return (
    <main className="page-shell">
      <section className="hero home-intro journal-index-hero" id="journal">
        <aside className="hero-panel">
          <div className="hero-panel-card">
            <div className="journal-heading-row">
              <div>
                <p className="eyebrow">Travel Journal</p>
                <h1>Fresh reads for couples escapes, family resort trips, and European hotel stays</h1>
              </div>
              <a className="button button-secondary" href="/collections">
                Browse collections
              </a>
            </div>
            <div className="journal-list">
              {journalPosts.map((post) => (
                <a key={post.slug} className="journal-card" href={`/journal/${post.slug}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 900px) 100vw, 178px"
                  />
                  <div>
                    <p className="journal-card-meta">
                      <span>{post.eyebrow}</span>
                      <span>{post.readTime}</span>
                    </p>
                    <strong>{post.title}</strong>
                    <span>{post.description}</span>
                  </div>
                  <span className="journal-card-arrow" aria-hidden="true">
                    &gt;
                  </span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

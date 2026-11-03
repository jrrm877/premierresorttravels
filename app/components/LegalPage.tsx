import type { ReactNode } from "react";

type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  path: string;
  sections: LegalSection[];
};

const siteOrigin = "https://premierresorttravels.com";

export function LegalPage({ eyebrow, title, description, effectiveDate, path, sections }: LegalPageProps) {
  const pageUrl = `${siteOrigin}${path}`;
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: pageUrl,
    dateModified: "2026-11-03",
    publisher: {
      "@type": "TravelAgency",
      name: "Premier Resort Travel",
      url: `${siteOrigin}/`,
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: title, item: pageUrl },
    ],
  };

  return (
    <main className="page-shell legal-page" id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />

      <header className="property-details legal-page-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
        <p className="legal-page-date"><strong>Effective date:</strong> {effectiveDate}</p>
      </header>

      <div className="legal-page-layout">
        <aside className="legal-page-toc" aria-label={`${title} sections`}>
          <strong>On this page</strong>
          <ol>
            {sections.map((section) => (
              <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>
            ))}
          </ol>
        </aside>

        <article className="legal-page-content">
          {sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.content}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

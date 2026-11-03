import type { Route } from "./+types/contact";

const siteOrigin = "https://premierresorttravels.com";

export function meta(_: Route.MetaArgs) {
  const title = "Contact Premier Resort Travel | Vacation Planning Help";
  const description = "Contact Premier Resort Travel by phone or email, or request personalized resort and vacation planning options online.";
  const url = `${siteOrigin}/contact`;
  const image = `${siteOrigin}/images/home-about-gallery-main.jpg`;
  return [
    { title },
    { tagName: "link", rel: "canonical", href: url },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Premier Resort Travel" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: "Plan a vacation with Premier Resort Travel" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Premier Resort Travel",
    description: "Phone, email, and online vacation-planning contact options for Premier Resort Travel.",
    url: `${siteOrigin}/contact`,
    mainEntity: {
      "@type": "TravelAgency",
      "@id": `${siteOrigin}/#agency`,
      name: "Premier Resort Travel",
      legalName: "Premier Resort Travel, LLC",
      url: `${siteOrigin}/`,
      logo: `${siteOrigin}/images/brand/premier-resort-travel-horizontal-logo.png`,
      telephone: "+1-515-240-4002",
      email: "relax@premierresorttravels.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pleasantville",
        addressRegion: "IA",
        addressCountry: "US",
      },
      areaServed: { "@type": "Country", name: "United States" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+1-515-240-4002",
        email: "relax@premierresorttravels.com",
        availableLanguage: "English",
        url: `${siteOrigin}/contact`,
      },
      sameAs: ["https://www.facebook.com/profile.php?id=61579557773966"],
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${siteOrigin}/contact` },
    ],
  };

  return (
    <main className="page-shell contact-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />

      <section className="property-details contact-page-hero" aria-labelledby="contact-heading">
        <div className="section-heading section-heading-stack">
          <p className="eyebrow">Contact Premier Resort Travel</p>
          <h1 id="contact-heading">Let&apos;s start planning your next vacation.</h1>
          <p className="lede">Reach us by phone or email for general questions, or use the trip planner when you are ready for personalized resort options.</p>
        </div>
      </section>

      <section className="property-details" aria-label="Premier Resort Travel contact options">
        <div className="planning-grid contact-option-grid">
          <article className="planning-card">
            <p className="eyebrow">Call</p>
            <h2><a href="tel:+15152404002">515-240-4002</a></h2>
            <p>Call to discuss a resort, destination, group trip, honeymoon, or destination wedding.</p>
          </article>
          <article className="planning-card">
            <p className="eyebrow">Email</p>
            <h2><a href="mailto:relax@premierresorttravels.com">relax@premierresorttravels.com</a></h2>
            <p>Send your questions or a short description of the trip you are considering.</p>
          </article>
          <article className="planning-card">
            <p className="eyebrow">Request Options</p>
            <h2>Personalized vacation planning</h2>
            <p>Share your dates, travelers, budget, and priorities so we can begin comparing suitable options.</p>
            <a className="button button-primary" href="/quote?origin=contact">Get my free vacation quote</a>
          </article>
        </div>
      </section>

      <section className="property-details contact-business-details" aria-labelledby="business-details-heading">
        <div className="section-heading section-heading-stack">
          <p className="eyebrow">Business Information</p>
          <h2 id="business-details-heading">Premier Resort Travel, LLC</h2>
          <p>Premier Resort Travel is a family-owned travel agency based in Pleasantville, Iowa, serving travelers nationwide with personalized resort research and vacation-planning support. We do not operate a public walk-in office.</p>
          <p>Online quote requests can be sent anytime. Contact and trip planning are available by phone, email, and the online quote request, with scheduling based in the Central Time Zone.</p>
          <p>For the fastest response, include your approximate dates, number of travelers, preferred destination or resort, and whether you would like airfare included.</p>
        </div>
      </section>
    </main>
  );
}

import type { Route } from "./+types/contact";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Contact Premier Resort Travel | Vacation Planning Help" },
    { name: "description", content: "Contact Premier Resort Travel for personalized resort recommendations, vacation questions, and trip planning assistance." },
    { tagName: "link", rel: "canonical", href: "https://premierresorttravels.com/contact" },
  ];
}

export default function ContactPage() {
  return (
    <main className="page-shell">
      <section className="property-details" style={{ maxWidth: 850, margin: "3rem auto" }}>
        <p className="eyebrow">Get in touch</p>
        <h1>Contact Premier Resort Travel</h1>
        <p className="lede">Have a question about your next vacation? Tell us where you want to go and what matters most to you. We personally review inquiries during normal daytime business hours.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="/quote?origin=contact">Request a Personalized Quote</a>
          <a className="button button-secondary" href="/about">Learn About Us</a>
        </div>
        <p>No reservation is made when you send an inquiry.</p>
      </section>
    </main>
  );
}

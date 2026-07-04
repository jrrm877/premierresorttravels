import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./styles.css";

const footerLinkGroups = [
  {
    title: "Quick Links",
    icon: "compass",
    links: [
      ["Destinations", "/destinations"],
      ["Hotel Collections", "/collections"],
      ["Travel Resources", "/journal"],
      ["Our Travelers", "/traveler-stories"],
      ["About Us", "/about"],
      ["Contact Us", "/?popup=start"],
      ["Travel Blog", "/journal"],
      ["FAQ", "/journal"],
    ],
  },
  {
    title: "Top Destinations",
    icon: "pin",
    links: [
      ["Mexico", "/destinations"],
      ["Caribbean", "/destinations"],
      ["Jamaica", "/destinations"],
      ["Italy", "/destinations"],
      ["Maldives", "/destinations"],
      ["Hawaii", "/destinations"],
      ["Europe", "/destinations"],
      ["All Destinations", "/destinations"],
    ],
  },
  {
    title: "Hotel Collections",
    icon: "hotel",
    links: [
      ["Palace Resorts", "/collections/palace-resorts"],
      ["Le Blanc", "/collections/le-blanc"],
      ["Moon Palace", "/collections/moon-palace"],
      ["Baglioni Hotels", "/collections/baglioni"],
      ["Cozumel Palace", "/collections/palace-resorts"],
      ["Playacar Palace", "/collections/palace-resorts"],
      ["Luxury Boutique Hotels", "/collections/baglioni"],
      ["All Collections", "/collections"],
    ],
  },
  {
    title: "Travel Resources",
    icon: "bag",
    links: [
      ["Packing Lists", "/journal"],
      ["Resort Finder", "/journal"],
      ["Family Travel", "/journal"],
      ["Destination Weddings", "/journal"],
      ["Romantic Getaways", "/journal"],
      ["Group Travel", "/journal"],
      ["Travel Tips & Guides", "/journal"],
      ["Where to Go When", "/journal"],
    ],
  },
] as const;

const footerBenefits = [
  "Personalized recommendations",
  "Palace Pro Agents",
  "No booking fees",
  "Family-owned agency",
  "Firsthand travel experience",
  "Dedicated, attentive service",
] as const;

const footerHighlights = [
  ["Beach Resorts", "Sun. Sand. Unwind.", "palm"],
  ["Family Vacations", "Memories together.", "family"],
  ["Romantic Getaways", "For two. Perfectly.", "heart"],
  ["Destination Weddings", "Your day. Our expertise.", "ring"],
  ["Adults Only", "Relax. Reconnect.", "lotus"],
  ["Group Travel", "Together is better.", "globe"],
] as const;

function FooterIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (name === "phone") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" /></svg>;
  }
  if (name === "mail") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M4 5h16v14H4z" /><path {...common} d="m4 7 8 6 8-6" /></svg>;
  }
  if (name === "compass") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" /></svg>;
  }
  if (name === "pin") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 21s7-5.7 7-12a7 7 0 1 0-14 0c0 6.3 7 12 7 12Z" /><circle {...common} cx="12" cy="9" r="2.4" /></svg>;
  }
  if (name === "hotel") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M4 21V8l8-5 8 5v13" /><path {...common} d="M8 21v-7h8v7M8 10h.1M12 10h.1M16 10h.1" /></svg>;
  }
  if (name === "bag") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M6 7h12l1 14H5L6 7Z" /><path {...common} d="M9 7a3 3 0 0 1 6 0" /></svg>;
  }
  if (name === "star") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>;
  }
  if (name === "family") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="8" cy="7" r="2.2" /><circle {...common} cx="16" cy="7" r="2.2" /><circle {...common} cx="12" cy="11" r="2" /><path {...common} d="M3.5 20c.5-3 2-5 4.5-5s4 2 4.5 5M11.5 20c.5-3 2-5 4.5-5s4 2 4.5 5" /></svg>;
  }
  if (name === "heart") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21l8.8-8a5.2 5.2 0 0 0 0-7.4Z" /></svg>;
  }
  if (name === "ring") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M9 3h6l-2 4h-2L9 3Z" /><circle {...common} cx="12" cy="15" r="6" /></svg>;
  }
  if (name === "lotus") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 20c-5 0-8-3.5-9-8 3 0 6 1.2 9 8Z" /><path {...common} d="M12 20c5 0 8-3.5 9-8-3 0-6 1.2-9 8Z" /><path {...common} d="M12 20c-3-3.4-3-7.4 0-11 3 3.6 3 7.6 0 11Z" /></svg>;
  }
  if (name === "globe") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9S14.4 18.5 12 21c-2.4-2.5-3.5-5.5-3.5-9S9.6 5.5 12 3Z" /></svg>;
  }
  if (name === "palm") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 21V9" /><path {...common} d="M12 9C9 5 5.8 4.1 3 5.4c3.6.6 6.2 2 9 3.6Z" /><path {...common} d="M12 9c3-4 6.2-4.9 9-3.6-3.6.6-6.2 2-9 3.6Z" /><path {...common} d="M12 9C9.5 8 7.4 8.5 5.5 11c2.8-.9 4.9-.8 6.5-2Z" /><path {...common} d="M12 9c2.5-1 4.6-.5 6.5 2-2.8-.9-4.9-.8-6.5-2Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 3v18M3 12h18" /></svg>;
}

export function links() {
  return [
    { rel: "icon", type: "image/png", href: "/images/brand/premier-resort-travel-favicon.png" },
    { rel: "apple-touch-icon", href: "/images/brand/premier-resort-travel-favicon.png" },
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header-inner">
              <NavLink className="site-brand" to="/">
                <img
                  className="site-brand-logo"
                  src="/images/brand/premier-resort-travel-horizontal-logo.png"
                  alt="Premier Resort Travel"
                />
                <span className="site-brand-copy">
                  <strong>Premier Resort Travel</strong>
                  <span className="site-brand-seo-line">Curated resorts, hotels, and vacations for meaningful trips</span>
                </span>
              </NavLink>

              <nav className="site-nav" aria-label="Main menu">
                <NavLink className="site-nav-link site-nav-home-link" to="/" end aria-label="Home">
                  <span className="site-nav-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M3 10.6 12 3l9 7.6" />
                      <path d="M5.5 9.5V21h13V9.5" />
                      <path d="M9.5 21v-6h5v6" />
                    </svg>
                  </span>
                </NavLink>
                <NavLink className="site-nav-link" to="/destinations">
                  Destinations
                </NavLink>
                <NavLink className="site-nav-link" to="/collections">
                  Collections
                </NavLink>
                <NavLink className="site-nav-link" to="/journal">
                  Resources
                </NavLink>
                <NavLink className="site-nav-link" to="/traveler-stories">
                  Our Travelers
                </NavLink>
                <NavLink className="site-nav-link" to="/about">
                  About Us
                </NavLink>
              </nav>

              <a className="button button-primary site-header-cta" href="/?popup=start">
                Start Planning
              </a>
            </div>
          </header>

          <Outlet />

          <footer className="site-footer">
            <div className="site-footer-panel">
              <div className="site-footer-top">
                <section className="site-footer-brand-block" aria-label="Premier Resort Travel">
                  <img
                    className="site-footer-logo"
                    src="/images/brand/premier-resort-travel-horizontal-logo.png"
                    alt="Premier Resort Travel"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="site-footer-copy">
                    We help couples, families, and groups discover exceptional resorts,
                    unforgettable destinations, and vacations they&apos;ll be talking about for years.
                  </p>
                </section>

                <section className="site-footer-contact" aria-label="Contact Premier Resort Travel">
                  <h2>Let&apos;s Plan Your Next Escape</h2>
                  <p>Personalized. Trusted. Unforgettable.</p>
                  <a className="site-footer-contact-link" href="tel:+15152404002">
                    <FooterIcon name="phone" />
                    <span>515-240-4002</span>
                  </a>
                  <a className="site-footer-contact-link" href="mailto:jazmin@premierresorttravels.com">
                    <FooterIcon name="mail" />
                    <span>jazmin@premierresorttravels.com</span>
                  </a>
                  <div className="site-footer-socials" aria-label="Social links">
                    <a
                      href="https://www.facebook.com/profile.php?id=61579557773966"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Premier Resort Travel on Facebook"
                    >
                      f
                    </a>
                    <span aria-label="Instagram">◎</span>
                    <span aria-label="Pinterest">p</span>
                    <span aria-label="YouTube">▶</span>
                  </div>
                </section>

                <section className="site-footer-pro" aria-label="Palace Pro affiliation">
                  <a className="button button-primary site-footer-plan-button" href="/?popup=start">
                    Start Planning
                    <span aria-hidden="true">→</span>
                  </a>
                  <img src="/images/logo-palace-pro-agents.svg" alt="Pro Agents Palace Specialist Program" loading="lazy" decoding="async" />
                  <p>Official Palace Pro Agent<br />Preferred Partner</p>
                </section>
              </div>

              <p className="site-footer-seo">
                <span aria-hidden="true">✦</span>
                Premier Resort Travel specializes in luxury all-inclusive resorts, destination weddings,
                family vacations, honeymoon planning, adults-only escapes, and boutique hotels throughout
                Mexico, the Caribbean, Europe, and beyond.
                <span aria-hidden="true">✦</span>
              </p>

              <div className="site-footer-directory">
                {footerLinkGroups.map((group) => (
                  <section className="site-footer-link-column" key={group.title}>
                    <h3>
                      <FooterIcon name={group.icon} />
                      <span>{group.title}</span>
                    </h3>
                    {group.links.map(([label, href]) => (
                      <a href={href} key={`${group.title}-${label}`}>
                        {label}
                      </a>
                    ))}
                  </section>
                ))}
                <section className="site-footer-link-column site-footer-benefits">
                  <h3>
                    <FooterIcon name="star" />
                    <span>Why Book With Us</span>
                  </h3>
                  {footerBenefits.map((benefit) => (
                    <span key={benefit}>✓ {benefit}</span>
                  ))}
                </section>
              </div>

              <div className="site-footer-highlights">
                {footerHighlights.map(([title, text, icon]) => (
                  <a href="/collections" key={title}>
                    <FooterIcon name={icon} />
                    <span>
                      <strong>{title}</strong>
                      <small>{text}</small>
                    </span>
                  </a>
                ))}
              </div>

              <div className="site-footer-newsletter">
                <div className="site-footer-newsletter-copy">
                  <span className="site-footer-newsletter-icon"><FooterIcon name="mail" /></span>
                  <span>
                    <strong>Get Resort Tips &amp; Exclusive Travel Inspiration</strong>
                    <small>Be the first to know about special offers, destination ideas, and expert travel advice.</small>
                  </span>
                </div>
                <form className="site-footer-subscribe" action="/journal" method="get">
                  <label className="sr-only" htmlFor="footer-email">Email address</label>
                  <input id="footer-email" name="email" type="email" placeholder="Your email address" />
                  <button type="submit">Subscribe</button>
                </form>
                <div className="site-footer-palace-note">
                  <span><FooterIcon name="palm" /></span>
                  <p><strong>Proudly a Palace Pro Agent</strong>Preferred partner with Palace Resorts, offering expert knowledge and exclusive access for your next escape.</p>
                </div>
              </div>
            </div>

            <div className="site-footer-bottom">
              <p>Creating unforgettable vacations for couples, families, and groups, one journey at a time.</p>
              <nav aria-label="Footer legal links">
                <span>© 2026 Premier Resort Travel, LLC. All rights reserved.</span>
                <a href="/destinations">Sitemap</a>
                <a href="/journal">Privacy Policy</a>
                <a href="/journal">Terms of Use</a>
                <a href="/journal">Accessibility</a>
                <a href="/?popup=start">Contact</a>
              </nav>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

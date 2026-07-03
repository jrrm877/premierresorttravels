import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./styles.css";

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
            <div className="site-footer-inner">
              <div>
                <img
                  className="site-footer-logo"
                  src="/images/brand/premier-resort-travel-horizontal-logo.png"
                  alt="Premier Resort Travel"
                  loading="lazy"
                  decoding="async"
                />
                <p className="site-footer-copy">
                  Personalized resort and hotel recommendations for couples, families, and
                  travelers planning a more memorable escape.
                </p>
              </div>
              <div className="site-footer-aside">
                <div className="site-footer-affiliation" aria-label="Palace Pro affiliation">
                  <img src="/images/logo-palace-pro-agents.png" alt="Palace Pro Specialist Agency" loading="lazy" decoding="async" />
                </div>
                <div className="site-footer-links">
                  <a href="/destinations">Destinations</a>
                  <a href="/collections">Collections</a>
                  <a href="/traveler-stories">Our Travelers</a>
                  <a href="/journal">Resources</a>
                  <a href="/about">About Us</a>
                  <a
                    className="site-footer-social-link"
                    href="https://www.facebook.com/profile.php?id=61579557773966"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Premier Resort Travel on Facebook"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                      <path d="M14.2 8.2V6.9c0-.7.5-.9 1-.9h1.7V3.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v.6H7v3.2h2.7V21h3.5v-9.6h2.9l.5-3.2h-3.4Z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

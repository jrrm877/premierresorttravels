import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./styles.css";

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
                  src="/images/premier-resort-travel-logo.png"
                  alt="Premier Resort Travel logo"
                />
                <span className="site-brand-copy">
                  <strong>
                    Premier Resort Travel
                    <span className="site-brand-home-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M3 10.6 12 3l9 7.6" />
                        <path d="M5.5 9.5V21h13V9.5" />
                        <path d="M9.5 21v-6h5v6" />
                      </svg>
                    </span>
                  </strong>
                  <span className="site-brand-seo-line">Curated resorts, hotels, and vacations for meaningful trips</span>
                </span>
              </NavLink>

              <nav className="site-nav" aria-label="Main menu">
                <NavLink className="site-nav-link" to="/destinations">
                  Destinations
                </NavLink>
                <a className="site-nav-link" href="/collections">
                  Collections
                </a>
                <NavLink className="site-nav-link" to="/journal">
                  Journal
                </NavLink>
                <NavLink className="site-nav-link" to="/traveler-stories">
                  Stories
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
                <p className="eyebrow">Premier Resort Travel</p>
                <p className="site-footer-copy">
                  Personalized resort and hotel recommendations for couples, families, and
                  travelers planning a more memorable escape.
                </p>
              </div>
              <div className="site-footer-aside">
                <div className="site-footer-affiliation" aria-label="Palace Pro affiliation">
                  <img src="/images/logo-palace-pro-agents.png" alt="Palace Pro Specialist Agency" loading="lazy" decoding="async" />
                  <span>Palace Pro Specialist Agency</span>
                </div>
                <div className="site-footer-links">
                  <a href="/destinations">Destinations</a>
                  <a href="/collections">Collections</a>
                  <a href="/traveler-stories">Traveler stories</a>
                  <a href="/journal">Travel journal</a>
                  <a href="/about">About Us</a>
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

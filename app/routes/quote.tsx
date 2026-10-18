import { useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/quote";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Request a Vacation Quote | Resort & Flight Options | Premier Resort Travel" },
    { name: "description", content: "Request personalized resort-only or resort-and-airfare vacation options from Premier Resort Travel. Tell us your dates, travelers, and preferences." },
    { name: "robots", content: "index,follow" },
    { tagName: "link", rel: "canonical", href: "https://premierresorttravels.com/quote" },
  ];
}

type InquiryResponse = { success?: boolean; message?: string };
export default function QuotePage() {
  const fetcher = useFetcher<InquiryResponse>();
  const [includeFlights, setIncludeFlights] = useState(false);
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [airport, setAirport] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");
  const sending = fetcher.state !== "idle";
  const invalidDates = Boolean(departure && returnDate && returnDate <= departure);
  const notes = [
    "Package requested: " + (includeFlights ? "Resort + airfare" : "Resort only"),
    "Check-in: " + (departure || "Flexible"),
    "Check-out: " + (returnDate || "Flexible"),
    "Adults: " + adults,
    "Children: " + children,
    ...(includeFlights ? ["Departure airport: " + airport.trim()] : []),
    ...(budget.trim() ? ["Approximate total trip budget (USD): " + budget.trim()] : []),
    ...(preferences.trim() ? ["Traveler preferences: " + preferences.trim()] : []),
  ].join("\n");

  return (
    <main className="page-shell" style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1.25rem 5rem" }}>
      <p className="eyebrow">Personalized Vacation Quotes</p>
      <h1>Your dream vacation, without the planning stress.</h1>
      <p className="lede" style={{ maxWidth: 680 }}>
        Tell us what you have in mind. We'll research resort availability and, if you prefer,
        airfare options too. No obligation to book.
      </p>
      <div style={{ maxWidth: 720, marginTop: 32, padding: 24, border: "1px solid #d5dcd9", borderRadius: 16 }}>
        {fetcher.data?.success ? (
          <div role="status">
            <h2>Request received.</h2>
            <p>Thanks! We'll review your trip details and follow up with personalized options. Prices and availability are confirmed when quoted.</p>
            <a className="button button-secondary" href="/collections">Explore resorts</a>
          </div>
        ) : (
          <fetcher.Form method="post" action="/api/inquiry" style={{ display: "grid", gap: 18 }}>
            <input type="hidden" name="source" value="vacation-quote" />
            <input type="hidden" name="tripStyle" value={includeFlights ? "Resort + airfare" : "Resort only"} />
            <input type="hidden" name="travelWindow" value={departure && returnDate ? departure + " to " + returnDate : "Flexible"} />
            <input type="hidden" name="notes" value={notes} />
            <fieldset style={{ border: 0, padding: 0 }}>
              <legend style={{ fontWeight: 700, marginBottom: 10 }}>What would you like included?</legend>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <label><input type="radio" name="packageChoice" checked={!includeFlights} onChange={() => setIncludeFlights(false)} /> Resort only</label>
                <label><input type="radio" name="packageChoice" checked={includeFlights} onChange={() => setIncludeFlights(true)} /> Resort + airfare</label>
              </div>
            </fieldset>
            <label style={{ display: "grid", gap: 6 }}>Destination or preferred resort
              <input name="destinationInterest" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Cancun, Moon Palace, or open to ideas" style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }} />
            </label>
            {includeFlights && <label style={{ display: "grid", gap: 6 }}>Departure airport or city
              <input value={airport} onChange={e => setAirport(e.target.value)} required placeholder="Des Moines (DSM)" style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }} />
            </label>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
              <label style={{ display: "grid", gap: 6 }}>Check-in date <input type="date" value={departure} onChange={e => setDeparture(e.target.value)} style={{ padding: 12 }} /></label>
              <label style={{ display: "grid", gap: 6 }}>Check-out date <input type="date" min={departure || undefined} value={returnDate} onChange={e => setReturnDate(e.target.value)} style={{ padding: 12 }} /></label>
              <label style={{ display: "grid", gap: 6 }}>Adults <select value={adults} onChange={e => setAdults(e.target.value)} style={{ padding: 12 }}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
              <label style={{ display: "grid", gap: 6 }}>Children <select value={children} onChange={e => setChildren(e.target.value)} style={{ padding: 12 }}>{[0,1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
            </div>
            <label style={{ display: "grid", gap: 6 }}>Approximate total budget in USD (optional)
              <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. $4,000 total" style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>Anything else we should know? (optional)
              <textarea value={preferences} onChange={e => setPreferences(e.target.value)} rows={3} placeholder="Room preferences, children's ages, flexible dates, accessibility needs..." style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>Full name <input name="fullName" required autoComplete="name" style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }} /></label>
            <label style={{ display: "grid", gap: 6 }}>Email address <input name="email" type="email" required autoComplete="email" style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }} /></label>
            <p style={{ fontSize: 14, margin: 0 }}>This is a request for an advisor-prepared quote, not a live-price search or booking. Rates, availability, and airfare are subject to confirmation. Your details are used to respond to your inquiry.</p>
            {invalidDates && <p role="alert">Check-out must be after check-in.</p>}
            {fetcher.data?.success === false && <p role="alert">{fetcher.data.message ?? "Please try again."}</p>}
            <button className="button button-primary" type="submit" disabled={sending || invalidDates}>{sending ? "Sending request..." : "Get My Free Vacation Quote"}</button>
          </fetcher.Form>
        )}
      </div>
    </main>
  );
}

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

export function loader({ request }: Route.LoaderArgs) {
  const params = new URL(request.url).searchParams;
  const style = params.get("style") ?? "";
  const resort = params.get("resort")?.trim().slice(0, 150) ?? "";
  const destination = params.get("origin") === "journal" ? (params.get("destination")?.trim().slice(0, 150) ?? "") : "";
  const origin = params.get("origin") === "property" && resort ? "Resort detail page" : params.get("origin") === "journal" ? "Travel journal" : "General quote page";
  const initialNote = params.get("origin") === "journal" ? (params.get("note")?.trim().slice(0, 500) ?? "") : "";
  return { style: ["Family", "Adults Only", "Romance"].includes(style) ? style : "", resort, destination, origin, initialNote };
}

type InquiryResponse = { success?: boolean; message?: string };
export default function QuotePage({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<InquiryResponse>();
  const [includeFlights, setIncludeFlights] = useState(false);
  const [destination, setDestination] = useState(loaderData.resort || loaderData.destination);
  const [tripStyle, setTripStyle] = useState(loaderData.style || "Not sure yet");
  const [datesKnown, setDatesKnown] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [airport, setAirport] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState(loaderData.initialNote);
  const sending = fetcher.state !== "idle";
  const invalidDates = Boolean(departure && returnDate && returnDate <= departure);
  const notes = [
    "Lead origin: " + loaderData.origin,
    ...(loaderData.origin === "Resort detail page" ? ["Originally selected resort: " + loaderData.resort] : []),
    "Preferred travel style: " + tripStyle,
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
      {loaderData.style && <p>Planning a {loaderData.style.toLowerCase()} getaway? You’re in the right place.</p>}
      <h1>Let’s plan your perfect getaway.</h1>
      <p className="lede" style={{ maxWidth: 680 }}>
        Just the basics: where you want to go, when you might travel, who is coming, and your budget. Not sure about something? That’s fine. No obligation to book.
      </p>
      <section aria-label="How your personalized quote works" style={{ maxWidth: 720, marginTop: 28 }}>
        <h2 style={{ fontSize: "1.35rem", marginBottom: 12 }}>What happens after you send your request?</h2>
        <ol style={{ display: "grid", gap: 12, paddingLeft: 22, lineHeight: 1.6 }}>
          <li><strong>We review your trip.</strong> Your destination, travelers and preferences help us understand what matters most.</li>
          <li><strong>We research the options.</strong> An advisor can compare resort choices, room categories and available pricing for your dates.</li>
          <li><strong>You decide.</strong> We'll follow up with personalized recommendations. There is no obligation to book.</li>
        </ol>
        <p style={{ fontSize: 14 }}>This form is an inquiry, not a payment or reservation. No booking is made when you submit it.</p>
      </section>
      <div style={{ maxWidth: 720, marginTop: 32, padding: 24, border: "1px solid #d5dcd9", borderRadius: 16 }}>
        {fetcher.data?.success ? (
          <div role="status">
            <h2>Request received.</h2>
            <p>Thank you! Your vacation request has been received. We'll review your trip details and follow up using the email you provided. No booking has been made. Prices and availability are confirmed when quoted.</p>
            <a className="button button-secondary" href="/collections">Explore resorts</a>
          </div>
        ) : (
          <fetcher.Form method="post" action="/api/inquiry" style={{ display: "grid", gap: 18 }}>
            <input type="hidden" name="source" value="vacation-quote" />
            <input type="hidden" name="tripStyle" value={tripStyle} />
            <input type="hidden" name="travelWindow" value={departure && returnDate ? departure + " to " + returnDate : "Flexible"} />
            <input type="hidden" name="notes" value={notes} />
            <label style={{ display: "grid", gap: 6 }}>What kind of vacation?
              <select value={tripStyle} onChange={e => setTripStyle(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }}>
                {["Not sure yet", "Family", "Adults Only", "Romance"].map(option => <option key={option} value={option}>{option === "Not sure yet" ? "Help me decide" : option}</option>)}
              </select>
            </label>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
              <label style={{ display: "grid", gap: 6 }}>Adults <select value={adults} onChange={e => setAdults(e.target.value)} style={{ padding: 12 }}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
              <label style={{ display: "grid", gap: 6 }}>Children <select value={children} onChange={e => setChildren(e.target.value)} style={{ padding: 12 }}>{[0,1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}><input type="checkbox" checked={datesKnown} onChange={e => { setDatesKnown(e.target.checked); if (!e.target.checked) { setDeparture(""); setReturnDate(""); } }} /> I have specific travel dates</label>
            {datesKnown && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
              <label style={{ display: "grid", gap: 6 }}>Check-in date <input type="date" value={departure} onChange={e => setDeparture(e.target.value)} style={{ padding: 12 }} /></label>
              <label style={{ display: "grid", gap: 6 }}>Check-out date <input type="date" min={departure || undefined} value={returnDate} onChange={e => setReturnDate(e.target.value)} style={{ padding: 12 }} /></label>
            </div>}
            <label style={{ display: "grid", gap: 6 }}>Approximate total vacation budget (optional)
              <select value={budget} onChange={e => setBudget(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }}>
                <option value="">Not sure yet — help me decide</option>
                <option value="Under $2,500">Under $2,500</option>
                <option value="$2,500–$4,000">$2,500–$4,000</option>
                <option value="$4,000–$6,000">$4,000–$6,000</option>
                <option value="$6,000–$10,000">$6,000–$10,000</option>
                <option value="$10,000+">$10,000+</option>
                <option value="Flexible">Flexible — show me options</option>
              </select>
            </label>
            <button type="button" aria-expanded={showDetails} onClick={() => setShowDetails(!showDetails)} style={{ background: "transparent", border: "none", textAlign: "left", padding: "8px 0", textDecoration: "underline", cursor: "pointer", font: "inherit" }}>{showDetails ? "Hide special requests −" : "Add special requests (optional) +"}</button>
            {showDetails && <>
              <label style={{ display: "grid", gap: 6 }}>Anything else we should know? (optional)
                <textarea value={preferences} onChange={e => setPreferences(e.target.value)} rows={3} placeholder="Room preferences, children's ages, flexible dates, accessibility needs..." style={{ padding: 12, borderRadius: 8, border: "1px solid #aab8b1" }} />
              </label>
            </>}
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

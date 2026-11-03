import { LegalPage } from "../components/LegalPage";
import type { Route } from "./+types/terms-and-conditions";

const title = "Terms and Conditions | Premier Resort Travel";
const description = "Review the website-use and travel-planning terms for Premier Resort Travel, including quotes, suppliers, traveler responsibilities, and booking conditions.";

export function meta(_: Route.MetaArgs) {
  return [
    { title },
    { tagName: "link", rel: "canonical", href: "https://premierresorttravels.com/terms-and-conditions" },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: "https://premierresorttravels.com/terms-and-conditions" },
  ];
}

export default function TermsAndConditionsPage() {
  const sections = [
    {
      id: "agreement",
      title: "Agreement and Eligibility",
      content: <p>These terms apply to your use of premierresorttravels.com and communications initiated through the website. By using the site, you agree to these terms. You must be at least 18 years old to submit a travel-planning request or enter into a booking arrangement.</p>,
    },
    {
      id: "planning-requests",
      title: "Planning Requests Are Not Bookings",
      content: <p>A website form, email, phone call, recommendation, itinerary idea, or preliminary quote is a request for information and does not create a reservation, guarantee availability, hold space, or form a contract for travel. A booking exists only after required traveler information, payments, and applicable confirmations have been completed.</p>,
    },
    {
      id: "prices-availability",
      title: "Prices, Availability, and Website Information",
      content: <p>Prices, promotions, room categories, airfare, taxes, fees, amenities, resort access, policies, schedules, and availability can change without notice. Website content is general planning guidance and may not reflect live inventory. Final details are controlled by the proposal, supplier terms, and confirmation documents applicable to your booking.</p>,
    },
    {
      id: "suppliers",
      title: "Independent Travel Suppliers",
      content: <><p>Premier Resort Travel acts as a travel advisor and intermediary. Hotels, resorts, airlines, tour operators, transfer providers, insurers, and other travel suppliers are independent businesses responsible for delivering their services.</p><p>Supplier terms—including deposits, final-payment dates, cancellation rules, change fees, refunds, credits, conduct rules, and liability provisions—apply to their services. Review those terms before authorizing a purchase.</p></>,
    },
    {
      id: "traveler-responsibilities",
      title: "Traveler Responsibilities",
      content: <><p>Travelers are responsible for reviewing all names, dates, destinations, room and flight details, prices, and booking documents before purchase and after confirmation. Travelers are also responsible for obtaining and checking passports, visas, entry authorizations, health documents, and other requirements applicable to their itinerary.</p><p>Requirements and advisories can change. Use official government and supplier sources and allow enough time to obtain required documents. Tell us promptly about errors, accessibility needs, dietary requests, medical considerations relevant to travel arrangements, or itinerary changes.</p></>,
    },
    {
      id: "payments-changes",
      title: "Payments, Changes, Cancellations, and Protection",
      content: <p>Payment schedules, accepted methods, change rights, cancellation penalties, refunds, and credits depend on the selected supplier and fare or rate. We will provide or direct you to the applicable terms before booking. Travel protection may be available and has its own coverage, exclusions, and claims process; purchasing or declining it is the traveler&apos;s decision.</p>,
    },
    {
      id: "travel-risks",
      title: "Travel Risks and Events Outside Our Control",
      content: <p>Travel involves risks and possible disruption, including weather, illness, labor actions, transportation changes, government actions, natural events, supplier changes, and other circumstances outside Premier Resort Travel&apos;s reasonable control. We may assist with available options, but we cannot guarantee supplier performance, uninterrupted travel, refunds, or a particular outcome.</p>,
    },
    {
      id: "website-use",
      title: "Acceptable Website Use and Intellectual Property",
      content: <><p>Site text, design, branding, graphics, and original content belong to Premier Resort Travel or are used with permission and are protected by applicable law. You may use the site for personal travel planning but may not reproduce, scrape, republish, impersonate, interfere with, introduce malicious code into, or misuse the site.</p><p>Links to third-party websites are provided for convenience. Their content, availability, security, and terms are controlled by their operators.</p></>,
    },
    {
      id: "disclaimers-liability",
      title: "Disclaimers and Limitation of Liability",
      content: <p>The website is provided on an “as available” basis for general information and planning. To the fullest extent permitted by applicable law, Premier Resort Travel disclaims warranties concerning uninterrupted access or complete, current, or error-free website content and is not liable for indirect, incidental, special, or consequential losses arising solely from website use. Nothing in these terms excludes liability that cannot lawfully be excluded or limits rights provided by applicable consumer law.</p>,
    },
    {
      id: "law-changes",
      title: "Applicable Law and Changes",
      content: <p>Except where applicable consumer law requires otherwise, these website terms are governed by the laws of the State of Iowa. We may update the terms as the website or services change. The revised version will be posted here with a new effective date. If one provision is unenforceable, the remaining provisions continue to apply.</p>,
    },
    {
      id: "contact",
      title: "Contact Us",
      content: <address className="legal-contact"><strong>Premier Resort Travel, LLC</strong><span>Pleasantville, Iowa · Serving travelers nationwide</span><a href="mailto:jazmin@premierresorttravels.com">jazmin@premierresorttravels.com</a><a href="tel:+15152404002">515-240-4002</a></address>,
    },
  ];

  return <LegalPage eyebrow="Website and planning terms" title="Terms and Conditions" description="These terms explain how the website, planning requests, quotes, supplier services, and traveler responsibilities work." effectiveDate="November 3, 2026" path="/terms-and-conditions" sections={sections} />;
}

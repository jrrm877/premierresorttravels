import { LegalPage } from "../components/LegalPage";
import type { Route } from "./+types/privacy-policy";

const title = "Privacy Policy | Premier Resort Travel";
const description = "Learn how Premier Resort Travel collects, uses, stores, and shares information submitted through its website and travel-planning services.";

export function meta(_: Route.MetaArgs) {
  return [
    { title },
    { tagName: "link", rel: "canonical", href: "https://premierresorttravels.com/privacy-policy" },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: "https://premierresorttravels.com/privacy-policy" },
  ];
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      content: <>
        <p>We collect information you choose to provide when you request a quote, send a note, call, email, or communicate with us through social media. This may include:</p>
        <ul>
          <li>your name and email address;</li>
          <li>destination or resort interests, trip style, approximate travel dates, budget, departure airport, and number of travelers;</li>
          <li>room preferences, children&apos;s ages, accessibility requests, and other planning notes; and</li>
          <li>communications, feedback, reviews, and information needed to research or support travel you ask us to arrange.</li>
        </ul>
        <p>Our hosting provider may also process standard technical data such as IP address, browser type, requested page, timestamps, and security or diagnostic information when you use the site.</p>
        <aside className="legal-note"><strong>Do not submit passport numbers, payment-card details, or travel-document images through the public website forms or social media.</strong> If sensitive information is needed for a booking, we will explain an appropriate way to provide it.</aside>
      </>,
    },
    {
      id: "how-we-use-information",
      title: "How We Use Information",
      content: <>
        <p>We use information to respond to inquiries, research and recommend travel options, prepare quotes, communicate about a proposed or confirmed trip, support travelers, maintain business records, secure and improve the website, and comply with applicable obligations.</p>
        <p>Submitting an inquiry does not create a booking. We may send an acknowledgment and follow-up messages related to your request. Promotional email would require an appropriate subscription or other lawful basis, and you may opt out of promotional messages.</p>
      </>,
    },
    {
      id: "storage-and-providers",
      title: "Storage and Service Providers",
      content: <>
        <p>Website inquiries are stored in a Cloudflare D1 database. Cloudflare also hosts the website and may process technical request and security data. We use Resend to deliver inquiry notifications and, for quote requests, an acknowledgment to the email address provided. Configured notification services may receive the inquiry details needed to deliver those messages.</p>
        <p>These providers process information on our behalf under their own service terms and security practices. Information may be processed in the United States or other locations where a provider operates.</p>
      </>,
    },
    {
      id: "sharing",
      title: "How We Share Information",
      content: <>
        <p>We do not sell personal information. We may share information when reasonably necessary with:</p>
        <ul>
          <li><strong>Travel suppliers</strong>, such as resorts, hotels, airlines, tour operators, transfer providers, excursion companies, and travel-protection providers, when you ask us to research or arrange services;</li>
          <li><strong>Service providers</strong> that support hosting, databases, email delivery, communications, security, and business operations;</li>
          <li><strong>Professional or legal recipients</strong> when needed to comply with law, respond to lawful requests, protect rights or safety, or obtain professional advice; and</li>
          <li><strong>A successor organization</strong> in connection with a merger, sale, reorganization, or similar business transaction.</li>
        </ul>
        <p>Travel suppliers are independent businesses and process information under their own privacy notices.</p>
      </>,
    },
    {
      id: "cookies-and-analytics",
      title: "Cookies, Analytics, and Social Platforms",
      content: <>
        <p>The public website does not currently include Google Analytics, Meta Pixel, or another advertising analytics tag. The protected advisor area uses a necessary, secure session cookie after an authorized sign-in. Hosting and security services may use necessary technologies or technical logs to deliver and protect the site.</p>
        <p>If you follow our Facebook link, message us, or interact with content on a third-party platform, that platform processes information under its own privacy policy. We may receive information you choose to send through that platform.</p>
        <p>If our use of analytics, advertising pixels, or public-site cookies changes, we will update this policy and provide any controls required by applicable law.</p>
      </>,
    },
    {
      id: "retention-security",
      title: "Retention and Security",
      content: <>
        <p>We retain inquiries and related communications for as long as reasonably needed to respond, provide requested services, maintain business and tax records, resolve disputes, prevent misuse, and comply with legal obligations. Retention can vary depending on whether an inquiry becomes a booking.</p>
        <p>We use reasonable administrative and technical safeguards designed for the nature of the information we handle. No internet transmission or storage system can be guaranteed completely secure.</p>
      </>,
    },
    {
      id: "children",
      title: "Children’s Privacy",
      content: <p>The website is intended for adults and we do not knowingly collect personal information directly from children under 13. A parent or guardian may provide information about a child when necessary to plan family travel. Contact us if you believe a child submitted information without appropriate permission.</p>,
    },
    {
      id: "privacy-rights",
      title: "Your Privacy Choices and Rights",
      content: <>
        <p>Depending on where you live and subject to applicable exceptions, you may have rights to request access to, correction of, deletion of, or a copy of personal information. You may also have rights concerning consent, certain disclosures, or particular processing practices.</p>
        <p>Email <a href="mailto:jazmin@premierresorttravels.com">jazmin@premierresorttravels.com</a> with the subject “Privacy Request” and describe your request. We may ask for information reasonably necessary to verify your identity. If an applicable law provides an appeal right and we decline a request, you may reply to the decision to appeal.</p>
      </>,
    },
    {
      id: "updates",
      title: "Updates to This Policy",
      content: <p>We may update this policy when our services, providers, or privacy practices change. The updated version will appear on this page with a revised effective date.</p>,
    },
    {
      id: "contact",
      title: "Contact Us",
      content: <address className="legal-contact"><strong>Premier Resort Travel, LLC</strong><span>Pleasantville, Iowa · Serving travelers nationwide</span><a href="mailto:jazmin@premierresorttravels.com">jazmin@premierresorttravels.com</a><a href="tel:+15152404002">515-240-4002</a></address>,
    },
  ];

  return <LegalPage eyebrow="Your trust matters" title="Privacy Policy" description="This policy explains how Premier Resort Travel, LLC handles information when you visit our website or ask us to help plan travel." effectiveDate="November 3, 2026" path="/privacy-policy" sections={sections} />;
}

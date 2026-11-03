import { LegalPage } from "../components/LegalPage";
import type { Route } from "./+types/accessibility";

const title = "Accessibility Statement | Premier Resort Travel";
const description = "Read Premier Resort Travel's accessibility goals, current approach, feedback options, and alternative ways to request travel-planning help.";
const url = "https://premierresorttravels.com/accessibility";
const image = "https://premierresorttravels.com/images/home-about-gallery-main.jpg";

export function meta(_: Route.MetaArgs) {
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
    { property: "og:image:alt", content: "Premier Resort Travel vacation planning" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export default function AccessibilityPage() {
  const sections = [
    {
      id: "commitment",
      title: "Our Commitment",
      content: <p>Premier Resort Travel wants people with a wide range of abilities and assistive technologies to be able to explore travel information, compare resorts, and request planning help. Accessibility is part of our ongoing website maintenance and content work.</p>,
    },
    {
      id: "standard",
      title: "Accessibility Standard and Status",
      content: <><p>We use the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA as our accessibility target. The website has not received a formal third-party conformance audit, so we do not claim full conformance.</p><p>We review pages through development checks and user feedback and work to improve issues as they are identified.</p></>,
    },
    {
      id: "measures",
      title: "Measures We Take",
      content: <><p>Our current accessibility practices include:</p><ul><li>semantic headings, landmarks, labels, and descriptive page titles;</li><li>keyboard-operable navigation and form controls;</li><li>visible focus treatment and readable color contrast;</li><li>alternative text for meaningful images and empty alternatives for decorative images;</li><li>form instructions and status or error messages; and</li><li>responsive layouts intended to support zoom and smaller screens.</li></ul></>,
    },
    {
      id: "limitations",
      title: "Known Limitations and Third-Party Content",
      content: <><p>Some third-party websites, embedded services, supplier materials, or externally hosted documents may not be controlled by Premier Resort Travel and may have different accessibility support. Interactive maps, image-heavy resort content, or newly added features may also present barriers we have not yet identified.</p><p>If something is not usable, contact us and we will make a reasonable effort to provide the information or planning service another way.</p></>,
    },
    {
      id: "feedback",
      title: "Accessibility Feedback and Assistance",
      content: <><p>Tell us which page or task was difficult, the browser or device you were using, and the format or accommodation that would help. You do not need to disclose a disability.</p><address className="legal-contact"><strong>Premier Resort Travel, LLC</strong><a href="mailto:relax@premierresorttravels.com?subject=Accessibility%20feedback">relax@premierresorttravels.com</a><a href="tel:+15152404002">515-240-4002</a><a href="/contact">Contact options</a></address></>,
    },
    {
      id: "technical",
      title: "Technical Information and Review",
      content: <p>The site relies on HTML, CSS, JavaScript, SVG, and WAI-ARIA where appropriate. This statement is based on internal self-evaluation and will be reviewed as the website changes or when accessibility feedback identifies a problem.</p>,
    },
  ];

  return <LegalPage eyebrow="Access for every traveler" title="Accessibility Statement" description="We are working to make the Premier Resort Travel website and planning experience usable for people with disabilities." effectiveDate="November 3, 2026" path="/accessibility" sections={sections} />;
}

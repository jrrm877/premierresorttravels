import { requireAdvisorAccess } from "../lib/advisor-access";
import { deliverInquiryNotifications } from "../lib/inquiry-notifications";
import type { Route } from "./+types/advisor.notifications";

function configuration(env: { RESEND_API_KEY?: string; INQUIRY_NOTIFY_FROM?: string; INQUIRY_NOTIFY_TO?: string }) {
  return {
    ready: Boolean(env.RESEND_API_KEY && env.INQUIRY_NOTIFY_FROM && env.INQUIRY_NOTIFY_TO),
    apiKey: Boolean(env.RESEND_API_KEY),
    from: Boolean(env.INQUIRY_NOTIFY_FROM),
    to: Boolean(env.INQUIRY_NOTIFY_TO),
  };
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  return Response.json({ configuration: configuration(context.cloudflare.env) }, { headers: { "Cache-Control": "no-store" } });
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer");
  if (origin !== url.origin && !(origin === null && referer && new URL(referer).origin === url.origin)) {
    return Response.json({ error: "Request verification failed. Reload and retry." }, { status: 403 });
  }
  const env = context.cloudflare.env;
  if (!configuration(env).ready) {
    return Response.json({ error: "One or more email settings are missing. Check Cloudflare Worker secrets." });
  }
  const result = await deliverInquiryNotifications({ ...env, INQUIRY_WEBHOOK_URL: undefined }, {
    inquiryId: "test-only",
    source: "advisor-email-test",
    fullName: "Advisor notification test",
    email: env.INQUIRY_NOTIFY_TO!,
    destinationInterest: "Email delivery test (not a traveler inquiry)",
    tripStyle: "",
    travelWindow: "",
    notes: "This is a test notification from the private advisor dashboard. No customer inquiry was created.",
  });
  return Response.json({ result, error: result.failed.length ? "Resend rejected the email. Check Cloudflare Worker logs and your Resend account for the reason." : null });
}

export function meta() {
  return [{ title: "Email Notifications | Premier Resort Travel" }, { name: "robots", content: "noindex, nofollow" }];
}

export default function AdvisorNotifications({ loaderData, actionData }: Route.ComponentProps) {
  const settings = (loaderData as { configuration: { ready: boolean; apiKey: boolean; from: boolean; to: boolean } }).configuration;
  const result = actionData as { error?: string | null; result?: { attempted: string[]; delivered: string[]; failed: string[] } } | undefined;
  return <main className="page-shell"><section className="property-details" style={{ maxWidth: 720, margin: "3rem auto" }}>
    <p className="eyebrow">Private advisor tools</p>
    <h1>Email notification test</h1>
    <p>Check whether Resend is configured and send one test email to your advisor notification address. This does not create a traveler inquiry or email a customer.</p>
    <p>API key: {settings.apiKey ? "Configured" : "Missing"} · Sender: {settings.from ? "Configured" : "Missing"} · Recipient: {settings.to ? "Configured" : "Missing"}</p>
    <form method="post" action="/advisor/notifications">
      <button type="submit" className="button button-primary" disabled={!settings.ready}>Send advisor test email</button>
    </form>
    {result?.error ? <p role="alert">{result.error}</p> : null}
    {result?.result ? <p role="status">Resend API: {result.result.delivered.includes("resend") ? "Accepted the test email. Check your inbox and spam folder." : "No successful email submission."} Acceptance does not guarantee inbox delivery.</p> : null}
    <p><a href="/advisor/inquiries">Return to inquiry dashboard</a></p>
  </section></main>;
}

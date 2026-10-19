import { advisorSessionCookie, hasAdvisorSession, validAdvisorCredentials } from "../lib/advisor-access";
import type { Route } from "./+types/advisor.login";

const noStore = { "Cache-Control": "no-store" };
function redirectTo(location: string, cookie?: string) {
  const headers = new Headers(noStore);
  headers.set("Location", location);
  if (cookie) headers.set("Set-Cookie", cookie);
  return new Response(null, { status: 303, headers });
}

export async function loader({ request, context }: Route.LoaderArgs) {
  if (await hasAdvisorSession(request, context.cloudflare.env)) {
    throw redirectTo("/advisor/inquiries");
  }
  const error = new URL(request.url).searchParams.get("error");
  return Response.json({ error: error === "credentials" ? "Incorrect username or password. Check the credentials saved in Cloudflare." : error === "request" ? "Your sign-in request could not be verified. Please reload and try again." : null }, { headers: noStore });
}

export async function action({ request, context }: Route.ActionArgs) {
  const expectedOrigin = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer");
  const sameOrigin = origin === expectedOrigin || (!origin && !!referer && new URL(referer).origin === expectedOrigin);
  if (!sameOrigin) return redirectTo("/advisor/login?error=request");
  const data = await request.formData();
  const username = String(data.get("username") ?? "");
  const password = String(data.get("password") ?? "");
  if (!validAdvisorCredentials(username, password, context.cloudflare.env)) {
    return redirectTo("/advisor/login?error=credentials");
  }
  return redirectTo("/advisor/inquiries", await advisorSessionCookie(context.cloudflare.env));
}

export function meta() {
  return [{ title: "Advisor Sign In | Premier Resort Travel" }, { name: "robots", content: "noindex, nofollow" }];
}

export default function AdvisorLogin({ loaderData }: Route.ComponentProps) {
  return <main className="page-shell"><section className="property-details" style={{ maxWidth: 520, margin: "3rem auto" }}>
    <p className="eyebrow">Private advisor access</p>
    <h1>Advisor sign in</h1>
    <p>Sign in to review traveler inquiries using your private Cloudflare credentials.</p>
    <form method="post" action="/advisor/login" style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
      <label style={{ display: "grid", gap: ".35rem" }}>Username<input name="username" type="text" autoComplete="username" required /></label>
      <label style={{ display: "grid", gap: ".35rem" }}>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {loaderData.error ? <p role="alert" style={{ color: "#a12d20" }}>{loaderData.error}</p> : null}
      <button className="button button-primary" type="submit">Sign in securely</button>
    </form>
  </section></main>;
}

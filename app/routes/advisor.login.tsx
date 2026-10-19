import { Form, useActionData } from "react-router";
import { advisorSessionCookie, hasAdvisorSession, validAdvisorCredentials } from "../lib/advisor-access";
import type { Route } from "./+types/advisor.login";

export async function loader({ request, context }: Route.LoaderArgs) {
  if (await hasAdvisorSession(request, context.cloudflare.env)) {
    throw new Response(null, { status: 302, headers: { Location: "/advisor/inquiries", "Cache-Control": "no-store" } });
  }
  return Response.json({}, { headers: { "Cache-Control": "no-store" } });
}

export async function action({ request, context }: Route.ActionArgs) {
  const origin = request.headers.get("Origin");
  if (origin !== new URL(request.url).origin) {
    return Response.json({ error: "Please reload this page and try again." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const data = await request.formData();
  const username = String(data.get("username") ?? "");
  const password = String(data.get("password") ?? "");
  if (!validAdvisorCredentials(username, password, context.cloudflare.env)) {
    return Response.json({ error: "Incorrect username or password. Please try again." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return new Response(null, { status: 303, headers: { Location: "/advisor/inquiries", "Set-Cookie": await advisorSessionCookie(context.cloudflare.env), "Cache-Control": "no-store" } });
}

export function meta() {
  return [{ title: "Advisor Sign In | Premier Resort Travel" }, { name: "robots", content: "noindex, nofollow" }];
}

export default function AdvisorLogin() {
  const data = useActionData() as { error?: string } | undefined;
  return <main className="page-shell"><section className="property-details" style={{ maxWidth: 520, margin: "3rem auto" }}>
    <p className="eyebrow">Private advisor access</p>
    <h1>Advisor sign in</h1>
    <p>Sign in to review traveler inquiries. Your account uses the private credentials configured in Cloudflare.</p>
    <Form method="post" replace style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
      <label style={{ display: "grid", gap: ".35rem" }}>Username<input name="username" type="text" autoComplete="username" required /></label>
      <label style={{ display: "grid", gap: ".35rem" }}>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {data?.error ? <p role="alert">{data.error}</p> : null}
      <button className="button button-primary" type="submit">Sign in securely</button>
    </Form>
  </section></main>;
}

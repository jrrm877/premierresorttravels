const COOKIE_NAME = "prt_advisor_session";
const MAX_AGE = 8 * 60 * 60;
type Secrets = { ADVISOR_USERNAME?: string; ADVISOR_PASSWORD?: string };

function configured(env: object) {
  const values = env as Secrets;
  if (!values.ADVISOR_USERNAME || !values.ADVISOR_PASSWORD) return null;
  return { username: values.ADVISOR_USERNAME, password: values.ADVISOR_PASSWORD };
}

function equal(a: string, b: string) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let difference = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) difference |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return difference === 0;
}

async function signature(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export function validAdvisorCredentials(username: string, password: string, env: object) {
  const values = configured(env);
  return !!values && equal(username, values.username) && equal(password, values.password);
}

export async function advisorSessionCookie(env: object) {
  const values = configured(env);
  if (!values) throw new Error("Advisor login is not configured");
  const expiry = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = String(expiry);
  const mac = await signature(payload, values.password + ":" + values.username);
  return `${COOKIE_NAME}=${payload}.${mac}; Path=/advisor; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export async function hasAdvisorSession(request: Request, env: object) {
  const values = configured(env);
  if (!values) return false;
  const cookie = request.headers.get("Cookie")?.split(";").map(s => s.trim()).find(s => s.startsWith(COOKIE_NAME + "="));
  const match = cookie?.slice(COOKIE_NAME.length + 1).match(/^(\\d{10})\\.([0-9a-f]{64})$/);
  if (!match) return false;
  const expiry = Number(match[1]);
  if (expiry <= Math.floor(Date.now() / 1000) || expiry > Math.floor(Date.now() / 1000) + MAX_AGE) return false;
  return equal(match[2], await signature(match[1], values.password + ":" + values.username));
}

export async function requireAdvisorAccess(request: Request, env: object) {
  if (!(await hasAdvisorSession(request, env))) {
    throw new Response(null, { status: 302, headers: { Location: "/advisor/login", "Cache-Control": "no-store" } });
  }
}

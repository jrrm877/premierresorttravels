/** Fail closed until both credentials are configured as Worker secrets. */
export function requireAdvisorAccess(request: Request, env: { ADVISOR_USERNAME?: string; ADVISOR_PASSWORD?: string }) {
  const deny = () => new Response("Advisor access requires authentication.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Premier Resort Travel Advisor", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
  if (!env.ADVISOR_USERNAME || !env.ADVISOR_PASSWORD) throw deny();
  const authorization = request.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Basic ")) throw deny();
  let decoded: string;
  try {
    decoded = atob(authorization.slice(6));
  } catch {
    throw deny();
  }
  const separator = decoded.indexOf(":");
  if (separator < 0) throw deny();
  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  const equal = (a: string, b: string) => {
    const bytesA = new TextEncoder().encode(a);
    const bytesB = new TextEncoder().encode(b);
    let diff = bytesA.length ^ bytesB.length;
    for (let i = 0; i < Math.max(bytesA.length, bytesB.length); i++) diff |= (bytesA[i] ?? 0) ^ (bytesB[i] ?? 0);
    return diff === 0;
  };
  if (!equal(username, env.ADVISOR_USERNAME) || !equal(password, env.ADVISOR_PASSWORD)) throw deny();
}

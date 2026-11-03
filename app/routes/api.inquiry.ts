import type { Route } from "./+types/api.inquiry";
import { deliverInquiryNotifications } from "../lib/inquiry-notifications";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const LOCAL_TURNSTILE_SECRET = "1x0000000000000000000000000000000AA";
const ALLOWED_ORIGINS = new Set([
  "https://premierresorttravels.com",
  "https://www.premierresorttravels.com",
]);

type TurnstileResult = {
  success?: boolean;
  action?: string;
  hostname?: string;
};

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ success: false, message }, { status, headers });
}

export async function action({ request, context }: Route.ActionArgs) {
  const requestUrl = new URL(request.url);
  const isLocal = ["localhost", "127.0.0.1"].includes(requestUrl.hostname);
  const origin = request.headers.get("Origin");

  if (origin && !ALLOWED_ORIGINS.has(origin) && !isLocal) {
    return jsonError("We could not verify this request. Please refresh the page and try again.", 403);
  }

  const clientIp = request.headers.get("CF-Connecting-IP");
  if (clientIp && context.cloudflare.env.INQUIRY_RATE_LIMITER) {
    const rateLimit = await context.cloudflare.env.INQUIRY_RATE_LIMITER.limit({ key: clientIp });
    if (!rateLimit.success) {
      return jsonError(
        "Too many requests were sent from this connection. Please wait a minute and try again.",
        429,
        { "Retry-After": "60" }
      );
    }
  }

  const formData = await request.formData();
  const source = formData.get("source")?.toString().trim() ?? "site-inquiry";
  const fullName = formData.get("fullName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const destinationInterest = formData.get("destinationInterest")?.toString().trim() ?? "";
  const tripStyle = formData.get("tripStyle")?.toString().trim() ?? "";
  const travelWindow = formData.get("travelWindow")?.toString().trim() ?? "";
  const notes = formData.get("notes")?.toString().trim() ?? "";
  const honeypot = formData.get("website")?.toString().trim() ?? "";
  const formStartedAt = Number(formData.get("formStartedAt")?.toString() ?? "0");
  const turnstileToken = formData.get("cf-turnstile-response")?.toString() ?? "";
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isQuickNote = source === "about-quick-note";
  const storedName = fullName || "Name pending";
  const expectedAction = isQuickNote ? "about_quick_note" : "vacation_quote";
  const expectedHostnames = isLocal
    ? new Set(["localhost", "127.0.0.1"])
    : new Set(["premierresorttravels.com", "www.premierresorttravels.com"]);

  if (honeypot) {
    return Response.json({ success: true, message: "Your inquiry has been received." });
  }

  if (!["vacation-quote", "about-quick-note"].includes(source)) {
    return jsonError("We could not verify this request. Please refresh the page and try again.", 403);
  }

  if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < 2_000 || Date.now() - formStartedAt > 86_400_000) {
    return jsonError("Please wait a moment, then submit the form again.", 400);
  }

  if (
    fullName.length > 150 ||
    email.length > 254 ||
    destinationInterest.length > 300 ||
    tripStyle.length > 150 ||
    travelWindow.length > 150 ||
    notes.length > 5_000
  ) {
    return jsonError("Some of the information is too long. Please shorten it and try again.", 400);
  }

  const turnstileSecret = context.cloudflare.env.TURNSTILE_SECRET ?? (isLocal ? LOCAL_TURNSTILE_SECRET : "");
  if (!turnstileSecret || !turnstileToken || turnstileToken.length > 2_048) {
    return jsonError("Please complete the spam protection check and try again.", 403);
  }

  let turnstileResult: TurnstileResult;
  try {
    const verification = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken,
        remoteip: clientIp ?? "",
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!verification.ok) throw new Error(`Turnstile verification returned ${verification.status}`);
    turnstileResult = await verification.json<TurnstileResult>();
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return jsonError("Spam protection could not verify this request. Please try again.", 403);
  }

  if (
    !turnstileResult.success ||
    turnstileResult.action !== expectedAction ||
    !turnstileResult.hostname ||
    !expectedHostnames.has(turnstileResult.hostname)
  ) {
    return jsonError("Spam protection could not verify this request. Please try again.", 403);
  }

  if (!email) {
    return Response.json(
      { success: false, message: "Please add your email so we know where to reply." },
      { status: 400 }
    );
  }

  if (!emailLooksValid) {
    return Response.json(
      { success: false, message: "Please use a valid email address so we can follow up." },
      { status: 400 }
    );
  }

  if (!isQuickNote && !fullName) {
    return Response.json(
      { success: false, message: "Please add your name and email so we can follow up." },
      { status: 400 }
    );
  }

  if (isQuickNote && !notes) {
    return Response.json(
      { success: false, message: "Please add a quick note so we know what kind of trip to help with." },
      { status: 400 }
    );
  }

  try {
    const { DB } = context.cloudflare.env;
    const result = await DB.prepare(
      `INSERT INTO travel_inquiries
        (full_name, email, destination_interest, trip_style, travel_window, notes)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(storedName, email, destinationInterest, tripStyle, travelWindow, notes)
      .run();

    await deliverInquiryNotifications(context.cloudflare.env, {
      inquiryId: result.meta.last_row_id ?? "",
      source,
      fullName: storedName,
      email,
      destinationInterest,
      tripStyle,
      travelWindow,
      notes,
    });

    return Response.json({
      success: true,
      inquiryId: result.meta.last_row_id,
      message: isQuickNote
        ? "Your note is in. We can now follow up by email with next-step suggestions."
        : "Your inquiry has been received. A travel advisor can now follow up with tailored options.",
    });
  } catch (error) {
    console.error("Failed to save inquiry", error);

    return Response.json(
      {
        success: false,
        message: "We could not save your inquiry just now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}

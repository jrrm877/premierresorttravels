import { allProperties } from "./property-data";
import { publishedTravelerStories } from "./traveler-stories";
export type InquiryNotificationEnv = {
  INQUIRY_NOTIFY_FROM?: string;
  INQUIRY_NOTIFY_TO?: string;
  INQUIRY_WEBHOOK_BEARER_TOKEN?: string;
  INQUIRY_WEBHOOK_SECRET?: string;
  INQUIRY_WEBHOOK_URL?: string;
  INQUIRY_SHEETS_SECRET?: string;
  RESEND_API_KEY?: string;
  SITE_BASE_URL?: string;
};

export type InquiryNotificationPayload = {
  inquiryId: number | string;
  source: string;
  fullName: string;
  email: string;
  destinationInterest: string;
  tripStyle: string;
  travelWindow: string;
  notes: string;
};

type DeliverySummary = {
  attempted: string[];
  delivered: string[];
  failed: string[];
};

function formatLabel(value: string) {
  return value.trim() || "Not provided";
}

function buildSubject(payload: InquiryNotificationPayload) {
  const tripHook =
    payload.destinationInterest || payload.tripStyle || payload.source.replace(/-/g, " ");

  return `New Premier Resort Travel inquiry: ${tripHook}`;
}

function buildTextBody(payload: InquiryNotificationPayload) {
  return [
    "A new Premier Resort Travel inquiry was submitted.",
    "",
    `Inquiry ID: ${payload.inquiryId}`,
    `Source: ${formatLabel(payload.source)}`,
    `Name: ${formatLabel(payload.fullName)}`,
    `Email: ${formatLabel(payload.email)}`,
    `Destination or Property: ${formatLabel(payload.destinationInterest)}`,
    `Trip Style: ${formatLabel(payload.tripStyle)}`,
    `Travel Window: ${formatLabel(payload.travelWindow)}`,
    "",
    "Notes:",
    payload.notes.trim() || "No additional notes were provided.",
  ].join("\n");
}

function buildHtmlBody(payload: InquiryNotificationPayload) {
  const rows = [
    ["Inquiry ID", String(payload.inquiryId)],
    ["Source", formatLabel(payload.source)],
    ["Name", formatLabel(payload.fullName)],
    ["Email", formatLabel(payload.email)],
    ["Destination or Property", formatLabel(payload.destinationInterest)],
    ["Trip Style", formatLabel(payload.tripStyle)],
    ["Travel Window", formatLabel(payload.travelWindow)],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:700;border-bottom:1px solid #e8dccf;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e8dccf;">${value}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Georgia,serif;background:#f8f1e8;padding:24px;color:#2d1f16;">
      <div style="max-width:680px;margin:0 auto;background:#fffdf9;border:1px solid #e8dccf;border-radius:18px;overflow:hidden;">
        <div style="padding:18px 24px;background:linear-gradient(135deg,#f0e0c6,#fbf6ee);border-bottom:1px solid #e8dccf;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9a724d;">Premier Resort Travel</p>
          <h1 style="margin:0;font-size:28px;line-height:1.15;">New inquiry received</h1>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rows}</table>
          <h2 style="margin:0 0 10px;font-size:16px;">Notes</h2>
          <p style="margin:0;padding:16px;background:#f8f3eb;border:1px solid #eadfcf;border-radius:14px;white-space:pre-wrap;line-height:1.6;">${payload.notes.trim() || "No additional notes were provided."}</p>
        </div>
      </div>
    </div>
  `;
}

async function sendResendNotification(
  env: InquiryNotificationEnv,
  payload: InquiryNotificationPayload
) {
  if (!env.RESEND_API_KEY || !env.INQUIRY_NOTIFY_TO || !env.INQUIRY_NOTIFY_FROM) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.INQUIRY_NOTIFY_FROM,
      to: [env.INQUIRY_NOTIFY_TO],
      reply_to: payload.email,
      subject: buildSubject(payload),
      text: buildTextBody(payload),
      html: buildHtmlBody(payload),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend notification failed: ${response.status} ${await response.text()}`);
  }

  return true;
}

async function sendWebhookNotification(
  env: InquiryNotificationEnv,
  payload: InquiryNotificationPayload
) {
  if (!env.INQUIRY_WEBHOOK_URL) {
    return false;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (env.INQUIRY_WEBHOOK_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${env.INQUIRY_WEBHOOK_BEARER_TOKEN}`;
  }

  if (env.INQUIRY_WEBHOOK_SECRET) {
    headers["x-inquiry-secret"] = env.INQUIRY_WEBHOOK_SECRET;
  }

  // Apps Script Web Apps cannot read arbitrary request headers in doPost.
  // Pass the shared secret in the JSON body only for the configured Sheets receiver.
  const isAppsScript = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(
    env.INQUIRY_WEBHOOK_URL
  );
  if (isAppsScript && !env.INQUIRY_SHEETS_SECRET) {
    throw new Error("Apps Script webhook requires INQUIRY_SHEETS_SECRET");
  }

  const response = await fetch(env.INQUIRY_WEBHOOK_URL, {
    method: "POST",
    headers,
    redirect: "follow",
    body: JSON.stringify({
      ...payload,
      submittedAt: new Date().toISOString(),
      siteBaseUrl: env.SITE_BASE_URL ?? "",
      ...(isAppsScript ? { secret: env.INQUIRY_SHEETS_SECRET } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Inquiry webhook failed: ${response.status}`);
  }

  // A 200 HTML login/error page is not proof of delivery to Google Sheets.
  if (isAppsScript) {
    const text = await response.text();
    let result: { success?: boolean; error?: string };
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Apps Script returned a non-JSON response");
    }
    if (result.success !== true) {
      throw new Error(`Apps Script rejected inquiry: ${result.error ?? "unknown"}`);
    }
  }

  return true;
}


function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}


function parseInquiryDetails(notes: string) {
  const fields = new Map<string, string>();
  for (const line of notes.split(/\r?\n/)) {
    const index = line.indexOf(": ");
    if (index > 0) fields.set(line.slice(0, index).trim(), line.slice(index + 2).trim());
  }
  return fields;
}

function getInquiryLinks(destination: string, tripStyle: string) {
  const base = "https://premierresorttravels.com";
  const value = destination.trim().toLowerCase();
  const uncertain = !value || /^(not provided|not sure|unsure|help me decide|open to ideas|flexible|anywhere|undecided)$/i.test(value);
  if (uncertain) {
    const collection = /adult/i.test(tripStyle) ? "adults-only" : /family/i.test(tripStyle) ? "family-friendly" : /romance/i.test(tripStyle) ? "romantic-getaways" : null;
    return [{ label: collection ? "Explore resorts that fit your style" : "Explore our resort collections", url: collection ? `${base}/collections/${collection}` : `${base}/collections` }];
  }
  const normalized = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const needle = normalized(value);
  const property = allProperties.find((p) => normalized(p.name) === needle || normalized(p.slug) === needle);
  if (property) {
    const stories = publishedTravelerStories().filter((story) => story.resortSlug === property.slug).slice(0, 2);
    return [
      { label: `Explore ${property.name}`, url: `${base}/properties/${property.slug}` },
      ...stories.map((story) => ({ label: `Read a ${property.name} traveler experience`, url: `${base}/traveler-stories/${story.slug}` })),
    ];
  }
  return [{ label: "Explore our resort collections", url: `${base}/collections` }];
}

async function sendCustomerAcknowledgment(
  env: InquiryNotificationEnv,
  payload: InquiryNotificationPayload
) {
  if (payload.source !== "vacation-quote" || !env.RESEND_API_KEY || !env.INQUIRY_NOTIFY_FROM) {
    return false;
  }
  const name = payload.fullName.trim().split(/\s+/)[0] || "there";
  const fields = parseInquiryDetails(payload.notes);
  const destination = payload.destinationInterest.trim();
  const rows: Array<[string, string]> = [
    ["Destination or resort", destination || "Open to recommendations"],
    ["Travel dates", payload.travelWindow.trim() || "Flexible"],
    ["Vacation style", payload.tripStyle.trim() || "Help me decide"],
    ["Package", fields.get("Package requested") ?? ""],
    ["Adults", fields.get("Adults") ?? ""],
    ["Children", fields.get("Children") ?? ""],
    ["Departure airport", fields.get("Departure airport") ?? ""],
    ["Budget", fields.get("Approximate total trip budget (USD)") ?? ""],
    ["Special requests", fields.get("Traveler preferences") ?? ""],
  ].filter(([, value]) => Boolean(value.trim()) && value !== "Not provided") as Array<[string, string]>;
  const links = getInquiryLinks(destination, payload.tripStyle);
  const intro = "Thank you for reaching out! We received your vacation inquiry and look forward to helping you plan something wonderful.";
  const hours = "We're real people who personally review every request. We work regular daytime business hours, so if you contacted us in the evening or over the weekend, we'll reply as soon as we can during our next available business hours.";
  const disclaimer = "This is an inquiry, not a reservation. Prices and availability are confirmed when quoted. There's no obligation to book.";
  const text = [
    `Hi ${name},`, "", intro, "", "Here is what you shared:",
    ...rows.map(([label, value]) => `${label}: ${value}`), "",
    destination && links.some((link) => link.label.startsWith("Explore ") && link.label !== "Explore our resort collections")
      ? "While you wait, you can explore your resort and related experiences:"
      : "Still exploring? Here are some ideas while we put together recommendations:",
    ...links.map((link) => `${link.label}: ${link.url}`), "",
    hours, "", disclaimer, "",
    "Need to update any details? Simply reply to this email.", "",
    "Warmly,", "Jazmin & Cullen", "Premier Resort Travel",
  ].join("\n");
  const summaryHtml = rows.map(([label, value]) =>
    `<tr><th align="left" style="padding:9px 10px;border-bottom:1px solid #e7dac8;vertical-align:top">${escapeHtml(label)}</th><td style="padding:9px 10px;border-bottom:1px solid #e7dac8">${escapeHtml(value)}</td></tr>`
  ).join("");
  const linksHtml = links.map(({ label, url }) =>
    `<p style="margin:8px 0"><a style="color:#17415e;text-decoration:underline" href="${escapeHtml(url)}">${escapeHtml(label)} →</a></p>`
  ).join("");
  // Table-based, inline-styled email for Gmail, Apple Mail and mobile clients.
  // Keep customer-specific values and URLs as live, selectable HTML.
  const html = `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#efe4d2;color:#182f46;font-family:Georgia,'Times New Roman',serif">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#efe4d2"><tr><td align="center" style="padding:22px 10px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;background:#fffaf0;border:1px solid #e0cfb5">
<tr><td align="center" style="padding:27px 24px 10px"><div style="font-family:Georgia,serif;color:#a77c43;font-size:29px;line-height:1">✦</div><div style="font-size:18px;letter-spacing:4px;font-weight:bold;color:#1a334e">PREMIER</div><div style="font-size:10px;letter-spacing:4px;color:#98703e">RESORT TRAVEL</div></td></tr>
<tr><td align="center" style="padding:13px 24px 12px"><div style="font-family:'Segoe Script','Brush Script MT',Georgia,cursive;font-style:italic;font-size:45px;line-height:1.2;color:#163b5b">Thank You ♡</div><div style="font-family:Georgia,serif;letter-spacing:3px;font-size:12px;color:#a57b43">FOR REACHING OUT</div><div style="color:#c69a55;padding-top:12px">──────── ♥ ────────</div></td></tr>
<tr><td style="padding:8px 30px 0"><h1 style="font-size:27px;line-height:1.2;font-weight:normal;margin:8px 0 15px;color:#19344f">Your vacation plans are in good hands!</h1><p style="font-size:16px;line-height:1.7;margin:0 0 13px">Hi ${escapeHtml(name)},</p><p style="font-size:16px;line-height:1.7;margin:0 0 15px">${escapeHtml(intro)}</p></td></tr>
<tr><td style="padding:5px 30px 10px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="background:#fff;border:8px solid #fff;box-shadow:0 3px 15px #d8c6ad"><img src="https://premierresorttravels.com/images/jazmin-cullen-scuba-email-new.webp" width="540" alt="Jazmin and Cullen scuba diving together on a vacation" style="display:block;width:100%;max-width:540px;height:auto;border:0"></td></tr></table><p style="font-family:Georgia,serif;font-style:italic;text-align:center;font-size:14px;color:#806345;margin:12px 0 8px">From our adventures to yours — we can't wait to help plan your next escape!</p></td></tr>
<tr><td style="padding:8px 30px"><h2 style="font-size:20px;color:#19344f;margin:12px 0 10px">Your vacation request</h2><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f8f0e5;border:1px solid #e7d8c4;font-size:14px;color:#2d2a27">${summaryHtml}</table></td></tr>
<tr><td style="padding:10px 30px"><h2 style="font-size:20px;margin:12px 0;color:#19344f">Explore while you wait</h2><p style="font-size:15px;line-height:1.6;margin:0 0 8px">Here are a few places to start dreaming about your trip:</p>${linksHtml}</td></tr>
<tr><td style="padding:8px 30px"><h2 style="font-family:'Segoe Script','Brush Script MT',Georgia,cursive;font-style:italic;font-size:23px;font-weight:normal;color:#17405f;margin:12px 0">A little note from us...</h2><p style="font-size:15px;line-height:1.75;margin:0 0 13px">${escapeHtml(hours)}</p><p style="font-size:15px;line-height:1.75;margin:0 0 15px">Thank you for trusting us with your plans. If anything changes, simply reply to this email.</p><p style="font-family:'Segoe Script','Brush Script MT',Georgia,cursive;font-style:italic;font-size:22px;line-height:1.6;color:#193b59;margin:10px 0 0">Warmly,<br>Jazmin &amp; Cullen</p><p style="font-size:11px;letter-spacing:2px;color:#8c6b44;margin:0 0 20px">PREMIER RESORT TRAVEL</p></td></tr>
<tr><td align="center" style="padding:0 30px 24px"><a href="https://premierresorttravels.com/collections" style="display:inline-block;background:#b6874d;color:#fff;text-decoration:none;padding:13px 26px;border-radius:25px;font-size:16px">Explore Resorts →</a></td></tr>
<tr><td style="border-top:1px solid #dfc7a6;padding:17px 30px 25px"><p style="font-size:12px;line-height:1.6;color:#716457;margin:0">${escapeHtml(disclaimer)}</p></td></tr>
</table></td></tr></table></body></html>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.INQUIRY_NOTIFY_FROM,
      to: [payload.email],
      ...(env.INQUIRY_NOTIFY_TO ? { reply_to: env.INQUIRY_NOTIFY_TO } : {}),
      subject: "We received your vacation plans | Premier Resort Travel",
      text, html,
    }),
  });
  if (!response.ok) throw new Error(`Resend customer acknowledgment failed: ${response.status} ${await response.text()}`);
  return true;
}

export async function deliverInquiryNotifications(
  env: InquiryNotificationEnv,
  payload: InquiryNotificationPayload
): Promise<DeliverySummary> {
  const attempted: string[] = [];
  const delivered: string[] = [];
  const failed: string[] = [];

  if (env.RESEND_API_KEY || env.INQUIRY_NOTIFY_TO || env.INQUIRY_NOTIFY_FROM) {
    attempted.push("resend");

    try {
      const wasDelivered = await sendResendNotification(env, payload);

      if (wasDelivered) {
        delivered.push("resend");
      } else {
        attempted.pop();
      }
    } catch (error) {
      failed.push("resend");
      console.error("Resend inquiry notification failed", error);
    }
  }

  if (env.INQUIRY_WEBHOOK_URL) {
    attempted.push("webhook");

    try {
      const wasDelivered = await sendWebhookNotification(env, payload);

      if (wasDelivered) {
        delivered.push("webhook");
      }
    } catch (error) {
      failed.push("webhook");
      console.error("Webhook inquiry notification failed", error);
    }
  }

  if (payload.source === "vacation-quote" && env.RESEND_API_KEY && env.INQUIRY_NOTIFY_FROM) {
    attempted.push("customer-confirmation");
    try {
      if (await sendCustomerAcknowledgment(env, payload)) {
        delivered.push("customer-confirmation");
      }
    } catch (error) {
      failed.push("customer-confirmation");
      console.error("Customer quote acknowledgment failed", error);
    }
  }

  return { attempted, delivered, failed };
}

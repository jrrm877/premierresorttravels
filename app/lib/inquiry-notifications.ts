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

async function sendCustomerAcknowledgment(
  env: InquiryNotificationEnv,
  payload: InquiryNotificationPayload
) {
  if (payload.source !== "vacation-quote" || !env.RESEND_API_KEY || !env.INQUIRY_NOTIFY_FROM) {
    return false;
  }

  const name = payload.fullName.trim().split(/\s+/)[0] || "there";
  const destination = formatLabel(payload.destinationInterest);
  const travelWindow = formatLabel(payload.travelWindow);
  const tripStyle = formatLabel(payload.tripStyle);
  const text = [
    `Hi ${name},`,
    "",
    "Thank you for reaching out to Premier Resort Travel! We received your vacation quote request.",
    "",
    `Destination or resort: ${destination}`,
    `Travel dates: ${travelWindow}`,
    `Trip type: ${tripStyle}`,
    "",
    "We'll personally review your trip details and follow up with tailored resort options. Prices and availability are confirmed when quoted; this is not a booking confirmation.",
    "There's no obligation to book.",
    "",
    "Have a question or need to update your request? Simply reply to this email.",
    "",
    "Premier Resort Travel",
  ].join("\n");
  const html = `<div style="background:#f8f1e8;padding:28px 12px;font-family:Georgia,serif;color:#2d1f16"><div style="max-width:600px;margin:auto;background:#fffdf9;border:1px solid #e8dccf;border-radius:16px;overflow:hidden"><div style="background:#f0e0c6;padding:24px"><p style="font-size:12px;letter-spacing:3px;color:#946c43">PREMIER RESORT TRAVEL</p><h1 style="margin:0;font-size:28px">Your getaway starts here.</h1></div><div style="padding:24px;line-height:1.7"><p>Hi ${escapeHtml(name)},</p><p>Thank you for reaching out! We've received your vacation quote request and look forward to helping you plan.</p><div style="background:#f8f3eb;padding:16px;border-radius:10px"><strong>Your request</strong><p>Destination or resort: ${escapeHtml(destination)}<br>Travel dates: ${escapeHtml(travelWindow)}<br>Trip type: ${escapeHtml(tripStyle)}</p></div><p>We'll personally review your details and follow up with tailored options. Prices and availability are confirmed when quoted; this is not a booking confirmation.</p><p>There's no obligation to book. Need to update your request? Simply reply to this email.</p><p>Warmly,<br><strong>Premier Resort Travel</strong></p></div></div></div>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.INQUIRY_NOTIFY_FROM,
      to: [payload.email],
      ...(env.INQUIRY_NOTIFY_TO ? { reply_to: env.INQUIRY_NOTIFY_TO } : {}),
      subject: "We received your vacation quote request | Premier Resort Travel",
      text,
      html,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend customer acknowledgment failed: ${response.status} ${await response.text()}`);
  }
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

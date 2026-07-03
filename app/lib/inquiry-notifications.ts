export type InquiryNotificationEnv = {
  INQUIRY_NOTIFY_FROM?: string;
  INQUIRY_NOTIFY_TO?: string;
  INQUIRY_WEBHOOK_BEARER_TOKEN?: string;
  INQUIRY_WEBHOOK_SECRET?: string;
  INQUIRY_WEBHOOK_URL?: string;
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

  const response = await fetch(env.INQUIRY_WEBHOOK_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...payload,
      submittedAt: new Date().toISOString(),
      siteBaseUrl: env.SITE_BASE_URL ?? "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Inquiry webhook failed: ${response.status} ${await response.text()}`);
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

  return { attempted, delivered, failed };
}

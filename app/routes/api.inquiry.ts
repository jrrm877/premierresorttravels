import type { Route } from "./+types/api.inquiry";
import { deliverInquiryNotifications } from "../lib/inquiry-notifications";

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const source = formData.get("source")?.toString().trim() ?? "site-inquiry";
  const fullName = formData.get("fullName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const destinationInterest = formData.get("destinationInterest")?.toString().trim() ?? "";
  const tripStyle = formData.get("tripStyle")?.toString().trim() ?? "";
  const travelWindow = formData.get("travelWindow")?.toString().trim() ?? "";
  const notes = formData.get("notes")?.toString().trim() ?? "";
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isQuickNote = source === "about-quick-note";
  const storedName = fullName || "Name pending";

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

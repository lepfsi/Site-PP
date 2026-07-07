import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@dailyops.tech";
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "DailyOps <onboarding@resend.dev>";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const { name, email, subject, message } = data;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `[DailyOps Contact] ${subject}`,
    html: `
      <h2>New contact message</h2>
      <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    `,
  });

  if (error) throw new Error(error.message);
}

export async function subscribeToNewsletter(email: string, lang: "EN" | "FR" = "EN") {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (audienceId) {
    const { error: contactError } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (contactError && !contactError.message.toLowerCase().includes("already")) {
      throw new Error(contactError.message);
    }
  }

  const { error: notifyError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    subject: "[DailyOps Newsletter] New subscriber",
    html: `<p>A new subscriber joined the DailyOps newsletter:</p><p><strong>${escapeHtml(email)}</strong></p>`,
  });

  if (notifyError) throw new Error(notifyError.message);

  const welcome =
    lang === "FR"
      ? {
          subject: "Bienvenue à la newsletter DailyOps",
          html: `
            <h2>Bienvenue chez DailyOps</h2>
            <p>Merci de vous être abonné à notre newsletter infrastructure hebdomadaire.</p>
            <p>Vous recevrez des guides production-ready, des alertes CVE et des insights ops éprouvés sur le terrain.</p>
            <p style="color:#64748b;font-size:12px;">DailyOps.Tech — Real-World IT Operations</p>
          `,
        }
      : {
          subject: "Welcome to DailyOps Newsletter",
          html: `
            <h2>Welcome to DailyOps</h2>
            <p>Thanks for subscribing to our weekly infrastructure newsletter.</p>
            <p>You'll receive production-ready guides, CVE alerts, and field-tested ops insights.</p>
            <p style="color:#64748b;font-size:12px;">DailyOps.Tech — Real-World IT Operations</p>
          `,
        };

  const { error: welcomeError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: welcome.subject,
    html: welcome.html,
  });

  if (welcomeError) throw new Error(welcomeError.message);
}
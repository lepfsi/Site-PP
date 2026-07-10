import { Resend } from "resend";
import type { Language } from "./translations";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/** Verified Resend sending domain (subdomain) */
export const RESEND_DOMAIN = process.env.RESEND_DOMAIN ?? "news.dailyops.tech";

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@dailyops.tech";

/** Inbox that receives contact, chat, and newsletter admin notifications */
export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? CONTACT_EMAIL;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? `DailyOps <noreply@${RESEND_DOMAIN}>`;

/** Resend Segment (or legacy Audience) for newsletter subscribers */
export const NEWSLETTER_SEGMENT_ID =
  process.env.RESEND_SEGMENT_ID ?? process.env.RESEND_AUDIENCE_ID ?? null;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getEmailStatus() {
  return {
    configured: isEmailConfigured(),
    from: FROM_EMAIL,
    domain: RESEND_DOMAIN,
    contactEmail: CONTACT_EMAIL,
    notifyEmail: NOTIFY_EMAIL,
    newsletterSegmentId: NEWSLETTER_SEGMENT_ID,
    audienceId: process.env.RESEND_AUDIENCE_ID ?? null,
    segmentId: process.env.RESEND_SEGMENT_ID ?? null,
    contactsStoredIn: "resend",
    usingDefaultFrom: !process.env.RESEND_FROM_EMAIL,
    notifyUsesPublicContact: NOTIFY_EMAIL === CONTACT_EMAIL,
  };
}

export function mapEmailError(message: string, lang: Language = "EN"): string {
  const lower = message.toLowerCase();

  if (lower.includes("only send testing emails") || lower.includes("verify a domain")) {
    return lang === "FR"
      ? `Configurez RESEND_FROM_EMAIL avec une adresse @${RESEND_DOMAIN} (domaine vérifié dans Resend).`
      : `Set RESEND_FROM_EMAIL to an address @${RESEND_DOMAIN} (domain verified in Resend).`;
  }

  if (lower.includes("resend_api_key") || lower.includes("not configured")) {
    return lang === "FR"
      ? "Service email non configuré (RESEND_API_KEY manquante sur Vercel)."
      : "Email service not configured (RESEND_API_KEY missing on Vercel).";
  }

  if (lower.includes("invalid") && lower.includes("from")) {
    return lang === "FR"
      ? `Adresse d'expédition invalide — utilisez une adresse @${RESEND_DOMAIN}.`
      : `Invalid sender — use an address @${RESEND_DOMAIN}.`;
  }

  return lang === "FR"
    ? "Échec de l'envoi. Réessayez ou écrivez à contact@dailyops.tech."
    : "Delivery failed. Try again or email contact@dailyops.tech.";
}

async function sendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!resend) throw new Error("RESEND_API_KEY is not configured");

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    html: payload.html,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = data;

  await sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: `[DailyOps Contact] ${subject}`,
    html: `
      <h2>Nouveau message contact</h2>
      <p><strong>De :</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
      <hr />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    `,
  });
}

export async function subscribeToNewsletter(email: string, lang: "EN" | "FR" = "EN") {
  if (!resend) throw new Error("RESEND_API_KEY is not configured");

  const { error: contactError } = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(NEWSLETTER_SEGMENT_ID ? { segments: [{ id: NEWSLETTER_SEGMENT_ID }] } : {}),
  });

  if (contactError && !contactError.message.toLowerCase().includes("already")) {
    throw new Error(contactError.message);
  }

  await sendEmail({
    to: NOTIFY_EMAIL,
    subject: "[DailyOps Newsletter] Nouvel abonné",
    html: `<p>Nouvel abonné newsletter :</p><p><strong>${escapeHtml(email)}</strong></p>`,
  });

  const welcome =
    lang === "FR"
      ? {
          subject: "Bienvenue à la newsletter DailyOps",
          html: `
            <h2>Bienvenue chez DailyOps</h2>
            <p>Merci pour votre inscription à notre newsletter infrastructure.</p>
            <p>Guides production-ready, alertes CVE et retours terrain — sans spam.</p>
            <p><a href="https://dailyops.tech">dailyops.tech</a></p>
          `,
        }
      : {
          subject: "Welcome to DailyOps Newsletter",
          html: `
            <h2>Welcome to DailyOps</h2>
            <p>Thanks for subscribing to our infrastructure newsletter.</p>
            <p>Production-ready guides, CVE alerts, and field-tested ops insights.</p>
            <p><a href="https://dailyops.tech">dailyops.tech</a></p>
          `,
        };

  await sendEmail({
    to: email,
    subject: welcome.subject,
    html: welcome.html,
  });
}

export async function sendChatEscalationEmail(data: {
  visitorEmail: string;
  visitorName?: string;
  summary: string;
  transcript: string;
  lang: string;
}) {
  const { visitorEmail, visitorName, summary, transcript, lang } = data;

  await sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: visitorEmail,
    subject: `[DailyOps Chat] Demande d'assistance expert`,
    html: `
      <h2>Escalade chat — assistance expert</h2>
      <p><strong>Langue :</strong> ${escapeHtml(lang)}</p>
      <p><strong>De :</strong> ${escapeHtml(visitorName || "Visiteur")} &lt;${escapeHtml(visitorEmail)}&gt;</p>
      <p><strong>Résumé :</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(summary)}</p>
      <hr />
      <p><strong>Transcript :</strong></p>
      <pre style="white-space: pre-wrap;font-size:12px;background:#f1f5f9;padding:12px;border-radius:8px;">${escapeHtml(transcript)}</pre>
    `,
  });
}
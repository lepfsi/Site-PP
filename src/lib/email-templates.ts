import type { Language } from "./translations";
import { SITE } from "./site";

const BRAND = {
  navy: "#0A1128",
  turquoise: "#22af9d",
  lightBg: "#f1f5f9",
  muted: "#64748b",
  border: "#e2e8f0",
} as const;

function unsubscribeUrl(email: string): string {
  return `${SITE.url}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
}

function socialRow(): string {
  const links = [
    { label: "LinkedIn", href: SITE.linkedin },
    { label: "X", href: SITE.x },
    { label: "GitHub", href: SITE.github },
    { label: "Facebook", href: SITE.facebook },
  ];

  return links
    .map(
      (l) =>
        `<a href="${l.href}" style="color:${BRAND.turquoise};text-decoration:none;font-size:12px;font-weight:700;margin:0 10px;">${l.label}</a>`,
    )
    .join("");
}

interface BrandedEmailOptions {
  lang: Language;
  preheader?: string;
  title: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  subscriberEmail?: string;
}

export function buildBrandedEmail({
  lang,
  preheader,
  title,
  bodyHtml,
  cta,
  subscriberEmail,
}: BrandedEmailOptions): string {
  const tagline = lang === "FR" ? "OPERATE · OPTIMIZE · SECURE" : "OPERATE · OPTIMIZE · SECURE";
  const signature = lang === "FR" ? "— L'équipe DailyOps" : "— The DailyOps team";
  const visitLabel = lang === "FR" ? "Visiter le site" : "Visit the site";
  const unsubLabel = lang === "FR" ? "Se désabonner" : "Unsubscribe";
  const contactLabel = lang === "FR" ? "Nous contacter" : "Contact us";

  const ctaBlock = cta
    ? `<p style="margin:28px 0 0;">
        <a href="${cta.href}" style="display:inline-block;background:${BRAND.navy};color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.04em;">${cta.label}</a>
       </p>`
    : `<p style="margin:28px 0 0;">
        <a href="${SITE.url}" style="display:inline-block;background:${BRAND.navy};color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.04em;">${visitLabel}</a>
       </p>`;

  const unsubBlock = subscriberEmail
    ? `<p style="margin:16px 0 0;font-size:11px;color:${BRAND.muted};">
        <a href="${unsubscribeUrl(subscriberEmail)}" style="color:${BRAND.muted};text-decoration:underline;">${unsubLabel}</a>
       </p>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang === "FR" ? "fr" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.lightBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.lightBg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:${BRAND.navy};padding:24px 28px;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
                DailyOps<span style="color:${BRAND.turquoise};">.Tech</span>
              </p>
              <p style="margin:6px 0 0;font-size:9px;font-weight:700;color:rgba(255,255,255,0.55);letter-spacing:0.22em;text-transform:uppercase;">${tagline}</p>
              <div style="margin-top:14px;height:3px;width:48px;background:linear-gradient(90deg,${BRAND.turquoise},transparent);border-radius:2px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <h1 style="margin:0 0 16px;font-size:20px;font-weight:800;color:${BRAND.navy};line-height:1.3;">${title}</h1>
              <div style="font-size:15px;line-height:1.65;color:#334155;">${bodyHtml}</div>
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid ${BRAND.border};background:#f8fafc;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:${BRAND.navy};">${signature}</p>
              <p style="margin:0 0 16px;font-size:12px;color:${BRAND.muted};">
                <a href="mailto:${SITE.contactEmail}" style="color:${BRAND.turquoise};text-decoration:none;">${contactLabel}</a>
                · <a href="${SITE.url}" style="color:${BRAND.turquoise};text-decoration:none;">dailyops.tech</a>
              </p>
              <p style="margin:0;text-align:center;">${socialRow()}</p>
              ${unsubBlock}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildNewsletterWelcomeEmail(lang: Language, email: string): { subject: string; html: string } {
  if (lang === "FR") {
    return {
      subject: "Bienvenue — newsletter DailyOps.Tech",
      html: buildBrandedEmail({
        lang,
        subscriberEmail: email,
        preheader: "Guides ops, alertes CVE et retours terrain — sans spam.",
        title: "Bienvenue à bord",
        bodyHtml: `
          <p>Merci pour votre inscription à la newsletter <strong>DailyOps.Tech</strong>.</p>
          <p>Vous recevrez des guides production-ready, des alertes CVE et des retours terrain sur l'infra, l'observabilité et la sécurité — <strong>sans spam</strong>.</p>
          <p>En attendant, explorez nos articles et ressources sur le site.</p>
        `,
        cta: { label: "Explorer les guides", href: `${SITE.url}/articles` },
      }),
    };
  }

  return {
    subject: "Welcome to DailyOps.Tech newsletter",
    html: buildBrandedEmail({
      lang,
      subscriberEmail: email,
      preheader: "Production guides, CVE alerts, and field-tested ops insights.",
      title: "Welcome aboard",
      bodyHtml: `
        <p>Thanks for subscribing to the <strong>DailyOps.Tech</strong> newsletter.</p>
        <p>You'll get production-ready guides, CVE alerts, and field-tested insights on infra, observability, and security — <strong>no spam</strong>.</p>
        <p>In the meantime, explore our articles and resources on the site.</p>
      `,
      cta: { label: "Browse guides", href: `${SITE.url}/articles` },
    }),
  };
}
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function page(title: string, message: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f1f5f9; margin: 0; padding: 40px 16px; }
    .card { max-width: 420px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; text-align: center; }
    h1 { font-size: 1.25rem; color: #0A1128; margin: 0 0 12px; }
    p { color: #475569; line-height: 1.5; margin: 0 0 20px; }
    a { color: #22af9d; font-weight: 700; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${SITE.url}">dailyops.tech</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return page(
      "DailyOps Newsletter",
      "Lien de désabonnement invalide. / Invalid unsubscribe link.",
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return page("DailyOps Newsletter", "Adresse email invalide. / Invalid email address.");
  }

  if (!resend) {
    return page(
      "DailyOps Newsletter",
      "Service temporairement indisponible. Écrivez à contact@dailyops.tech / Service unavailable.",
    );
  }

  try {
    const { error } = await resend.contacts.update({
      email,
      unsubscribed: true,
    });

    if (error) {
      console.error("Unsubscribe error:", error);
      return page(
        "DailyOps Newsletter",
        "Impossible de traiter la demande. Contactez contact@dailyops.tech / Could not process request.",
      );
    }

    return page(
      "Désabonnement confirmé",
      `L'adresse <strong>${email}</strong> ne recevra plus la newsletter DailyOps.<br/><br/>
       <span style="font-size:0.9em;">Unsubscribed — you will no longer receive DailyOps newsletter emails.</span>`,
    );
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return page(
      "DailyOps Newsletter",
      "Erreur serveur. Réessayez plus tard. / Server error. Please try again later.",
    );
  }
}
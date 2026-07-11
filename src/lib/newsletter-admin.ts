export function isNewsletterAdminAuthorized(request: Request): boolean {
  const secret =
    process.env.NEWSLETTER_SETUP_SECRET?.trim() ??
    process.env.LABS_ADMIN_SECRET?.trim();

  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const url = new URL(request.url);
  return url.searchParams.get("key") === secret;
}
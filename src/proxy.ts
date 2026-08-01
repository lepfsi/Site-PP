import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocaleExemptPath, stripLocale } from "@/lib/i18n";

/** Legacy index pages (index.html, default.php, home.asp …) → canonical home. */
const INDEX_FILE = /(?:^|\/)(?:index|default|home)\.(?:html?|php|asp|aspx|jsp)$/i;

/** Unprefixed content routes that get a locale 308 redirect. Everything else → real 404. */
const STATIC_PATHS = new Set([
  "/",
  "/articles",
  "/experience",
  "/about",
  "/contact",
  "/resources",
  "/labs",
  "/products",
  "/legal",
  "/privacy",
  "/newsletter/preview",
]);
const DYNAMIC_SEGMENTS = ["/articles/", "/category/", "/experience/", "/labs/"];

function isKnownContentPath(p: string): boolean {
  const normalized = p.replace(/\/+$/, "") || "/";
  if (STATIC_PATHS.has(normalized)) return true;
  return DYNAMIC_SEGMENTS.some((seg) => normalized.startsWith(seg));
}

/**
 * Public URLs: /en/... and /fr/...
 * Internally rewrites to unprefixed routes (existing app pages).
 * Bare paths (e.g. /articles) permanently redirect to /en/articles.
 *
 * Next.js 16+: file convention is `proxy.ts` (formerly `middleware.ts`).
 */
export function proxy(request: NextRequest) {
  // Normalize trailing slashes so /about/ and /about resolve to the same route
  let { pathname } = request.nextUrl;
  const trimmed = pathname.replace(/\/+$/, "");
  pathname = trimmed === "" ? "/" : trimmed;

  if (isLocaleExemptPath(pathname)) {
    return NextResponse.next();
  }

  // Legacy index files (/index.html, /index.php, /fr/index.php …) → locale home
  if (INDEX_FILE.test(pathname)) {
    const { locale } = stripLocale(pathname);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale ?? DEFAULT_LOCALE}`;
    return NextResponse.redirect(url, 308);
  }

  const { locale, path } = stripLocale(pathname);

  // Already localized → rewrite to internal page + set locale header/cookie
  if (locale) {
    const url = request.nextUrl.clone();
    url.pathname = path === "/" ? "/" : path;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", locale);

    const res = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    res.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  // Unprefixed → permanent redirect to default locale (known routes only)
  const url = request.nextUrl.clone();
  if (pathname === "" || pathname === "/") {
    url.pathname = `/${DEFAULT_LOCALE}`;
  } else if (isKnownContentPath(pathname)) {
    url.pathname = `/${DEFAULT_LOCALE}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  } else {
    // Unknown path → let Next.js render its real 404 (no pointless locale redirect)
    return NextResponse.next();
  }
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

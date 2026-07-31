import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocaleExemptPath, stripLocale } from "@/lib/i18n";

/**
 * Public URLs: /en/... and /fr/...
 * Internally rewrites to unprefixed routes (existing app pages).
 * Bare paths (e.g. /articles) permanently redirect to /en/articles.
 *
 * Next.js 16+: file convention is `proxy.ts` (formerly `middleware.ts`).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isLocaleExemptPath(pathname)) {
    return NextResponse.next();
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

  // Unprefixed → permanent redirect to default locale
  const url = request.nextUrl.clone();
  if (pathname === "/" || pathname === "") {
    url.pathname = `/${DEFAULT_LOCALE}`;
  } else {
    url.pathname = `/${DEFAULT_LOCALE}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  }
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

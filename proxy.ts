import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Locale routing (this Next version calls middleware "proxy").
 *
 * - `/en/*`  → served as-is (English tree).
 * - `/fa/*`  → the internal Persian tree; redirect to the clean prefix-free URL.
 * - everything else → rewritten to `/fa/*` so Persian keeps prefix-free URLs.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  if (pathname === "/fa" || pathname.startsWith("/fa/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/fa" : `/fa${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, the admin panel, generated metadata images
  // (they live under /[lang] and must not be locale-redirected), and any file
  // with an extension (icon.svg, sitemap.xml, robots.txt, images, …).
  matcher: [
    "/((?!_next/|api/|admin|.*opengraph-image|.*twitter-image|.*\\.).*)",
  ],
};

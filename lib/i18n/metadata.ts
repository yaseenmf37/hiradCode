import type { Metadata } from "next";

import { buildAlternates, type Locale, LOCALE_META } from "./config";

/** Standard per-page metadata: title, description, canonical + hreflang, OG. */
export function pageMeta(
  locale: Locale,
  path: string,
  meta: { title: string; description: string },
): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: LOCALE_META[locale].ogLocale,
      url: buildAlternates(locale, path).canonical,
    },
  };
}

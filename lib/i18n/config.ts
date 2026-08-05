/** Locale routing config. Persian is the default and lives at the root (`/`);
 *  English is served under `/en`. The proxy keeps Persian URLs prefix-free. */

export const LOCALES = ["fa", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fa";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hiradcode.ir";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_META: Record<
  Locale,
  { dir: "rtl" | "ltr"; htmlLang: string; ogLocale: string; label: string }
> = {
  fa: { dir: "rtl", htmlLang: "fa-IR", ogLocale: "fa_IR", label: "فارسی" },
  en: { dir: "ltr", htmlLang: "en-US", ogLocale: "en_US", label: "English" },
};

/**
 * Public path for a route in a given locale.
 * fa → prefix-free (`/works`), en → prefixed (`/en/works`).
 */
export function localePath(locale: Locale, path = "/"): string {
  const normalized = path === "" || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === "/" ? "/en" : `/en${normalized}`;
}

/**
 * Given a current public pathname, return the same page in the target locale.
 * Used by the language switcher.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  let base = pathname;
  if (base === "/en" || base === "/fa") base = "/";
  else if (base.startsWith("/en/") || base.startsWith("/fa/")) base = base.slice(3);
  return localePath(target, base);
}

/** hreflang + canonical block for a page, keyed by its locale-agnostic path. */
export function buildAlternates(locale: Locale, path = "/") {
  return {
    canonical: localePath(locale, path),
    languages: {
      "fa-IR": localePath("fa", path),
      "en-US": localePath("en", path),
      "x-default": localePath("fa", path),
    },
  };
}

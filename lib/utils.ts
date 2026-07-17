import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Route params reach page components still percent-encoded, so a Persian slug
 * arrives as "%D9%BE%D8%B1…" and never matches the stored value. Decode before
 * any lookup. ASCII slugs pass through untouched; a malformed escape sequence
 * falls back to the raw string rather than throwing.
 */
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** 1403 → ۱۴۰۳. Used anywhere a number is read as prose. */
export function toFa(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** Strips the protocol so links read as "example.com" rather than the full URL. */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Hex → "r g b", for use inside rgb(… / <alpha>) in inline styles. */
export function hexToRgbChannels(hex: string): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  const int = Number.parseInt(full, 16);
  if (Number.isNaN(int) || full.length !== 6) return "255 46 139";

  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}

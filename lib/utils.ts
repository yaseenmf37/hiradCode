import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Locale } from "./i18n/config";
import type { Post, Project } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Picks the project's display text for a locale. English falls back to the
 * Persian field whenever the English one is empty, so half-translated projects
 * still render cleanly.
 */
export function localizeProject(project: Project, locale: Locale) {
  const useEn = locale === "en";
  return {
    title: (useEn && project.titleEn) || project.title,
    subtitle: (useEn && project.subtitleEn) || project.subtitle,
    description: (useEn && project.descriptionEn) || project.description,
  };
}

/** Same fallback rule as localizeProject, for blog posts. */
export function localizePost(post: Post, locale: Locale) {
  const useEn = locale === "en";
  return {
    title: (useEn && post.titleEn) || post.title,
    excerpt: (useEn && post.excerptEn) || post.excerpt,
    content: (useEn && post.contentEn) || post.content,
  };
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

/** Persian digits for fa, plain Latin digits for en. */
export function fmtNum(locale: Locale, value: string | number): string {
  return locale === "en" ? String(value) : toFa(value);
}

/** Localized long date — Persian (Jalali) calendar for fa, Gregorian for en. */
export function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fa-IR", {
    dateStyle: "long",
  }).format(new Date(iso));
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
  if (Number.isNaN(int) || full.length !== 6) return "176 38 255";

  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}

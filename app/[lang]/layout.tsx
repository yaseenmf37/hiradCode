import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";
import {
  buildAlternates,
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_META,
  LOCALES,
  localePath,
  SITE_URL,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { SITE } from "@/lib/site-config";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#030207",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const meta = LOCALE_META[locale];
  const siteName = locale === "fa" ? SITE.name : SITE.nameEn;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.defaultTitle,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    authors: [{ name: "Hirad Code" }],
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      url: localePath(locale, "/"),
      siteName,
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const meta = LOCALE_META[lang];

  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={`${vazir.variable} h-full`}>
      <body className="grain-overlay bg-void text-fog-100 flex min-h-full flex-col antialiased">
        {children}
      </body>
    </html>
  );
}

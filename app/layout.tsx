import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";

import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hiradcode.ir";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "هیراد کد | طراحی و توسعه وب‌سایت",
    template: "%s | هیراد کد",
  },
  description:
    "استودیو طراحی و توسعه وب. ما وب‌سایت‌هایی می‌سازیم که سریع، زیبا و قابل اعتمادند — از هویت بصری تا آخرین خط کد.",
  keywords: [
    "طراحی سایت",
    "طراحی وب‌سایت",
    "توسعه وب",
    "طراحی رابط کاربری",
    "UI UX",
    "هیراد کد",
  ],
  authors: [{ name: "Hirad Code" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: "هیراد کد",
    title: "هیراد کد | طراحی و توسعه وب‌سایت",
    description: "استودیو طراحی و توسعه وب. وب‌سایت‌هایی که سریع، زیبا و قابل اعتمادند.",
  },
  twitter: {
    card: "summary_large_image",
    title: "هیراد کد | طراحی و توسعه وب‌سایت",
    description: "استودیو طراحی و توسعه وب. وب‌سایت‌هایی که سریع، زیبا و قابل اعتمادند.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05040a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="grain-overlay bg-void text-fog-100 flex min-h-full flex-col antialiased">
        {children}
      </body>
    </html>
  );
}

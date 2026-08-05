import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import "../globals.css";

/**
 * The admin panel is Persian-only and lives outside the `[lang]` tree, so it
 * carries its own root layout (html/body). Kept out of search indexes.
 */
const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa-IR" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="grain-overlay bg-void text-fog-100 flex min-h-full flex-col antialiased">
        {children}
      </body>
    </html>
  );
}

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { SiteSchema } from "@/components/site/site-schema";
import { Aurora } from "@/components/ui/aurora";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <>
      <SiteSchema locale={locale} dict={dict} />
      <Aurora />
      <Navbar locale={locale} dict={dict.nav} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

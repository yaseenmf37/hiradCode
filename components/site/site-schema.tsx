import { JsonLd } from "@/components/site/json-ld";
import type { Dictionary } from "@/lib/i18n";
import { type Locale, localePath, SITE_URL } from "@/lib/i18n/config";
import { SITE } from "@/lib/site-config";

/**
 * Site-wide structured data: who the studio is (Organization), the site itself
 * (WebSite), and a local business entry with the Gorgan address + hours — the
 * last one is what earns rich local results for "طراحی سایت گرگان".
 */
export function SiteSchema({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const name = locale === "en" ? SITE.nameEn : SITE.name;
  const sameAs = SITE.socials.map((s) => s.href);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    alternateName: locale === "en" ? SITE.name : SITE.nameEn,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    email: SITE.email,
    telephone: SITE.phoneRaw,
    description: dict.meta.description,
    sameAs,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: `${SITE_URL}${localePath(locale, "/")}`,
    inLanguage: locale === "en" ? "en" : "fa",
    publisher: { "@type": "Organization", name },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name,
    url: SITE_URL,
    image: `${SITE_URL}/icon.svg`,
    telephone: SITE.phoneRaw,
    email: SITE.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: dict.site.address,
      addressLocality: locale === "en" ? "Gorgan" : "گرگان",
      addressRegion: locale === "en" ? "Golestan" : "گلستان",
      addressCountry: "IR",
    },
    areaServed: locale === "en" ? "Iran" : "ایران",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "22:00",
    },
    sameAs,
  };

  return <JsonLd data={[organization, website, localBusiness]} />;
}

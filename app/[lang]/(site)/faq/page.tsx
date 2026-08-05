import type { Metadata } from "next";

import { CTA } from "@/components/site/cta";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { PageHeader } from "@/components/site/page-header";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return pageMeta(locale, "/faq", getDictionary(locale).meta.pages.faq);
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />

      <PageHeader
        eyebrow={dict.faqPage.eyebrow}
        title={
          <>
            {dict.faqPage.lead}
            <span className="text-gradient">{dict.faqPage.highlight}</span>
          </>
        }
        description={dict.faqPage.description}
      />

      <Faq
        items={dict.content.faq}
        heading={dict.faqComponent}
        showHeading={false}
      />

      <CTA locale={locale} dict={dict.cta} />
    </>
  );
}

import type { Metadata } from "next";

import { CTA } from "@/components/site/cta";
import { PageHeader } from "@/components/site/page-header";
import { WorksGallery } from "@/components/site/works-gallery";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/metadata";
import { getProjects, getUsedCategories } from "@/lib/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return pageMeta(locale, "/works", getDictionary(locale).meta.pages.works);
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const [projects, categories] = await Promise.all([
    getProjects(),
    getUsedCategories(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={dict.works.eyebrow}
        title={
          <>
            {dict.works.titleTop}
            <br />
            <span className="text-gradient">{dict.works.titleBottom}</span>
          </>
        }
        description={dict.works.description}
      />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <WorksGallery
          projects={projects}
          categories={categories}
          locale={locale}
          dict={dict.gallery}
        />
      </section>

      <CTA locale={locale} dict={dict.cta} />
    </>
  );
}

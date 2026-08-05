import type { Metadata } from "next";

import { CTA } from "@/components/site/cta";
import { JsonLd } from "@/components/site/json-ld";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale, localePath, SITE_URL } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/metadata";
import { getPublishedPosts } from "@/lib/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return pageMeta(locale, "/blog", getDictionary(locale).meta.pages.blog);
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const posts = await getPublishedPosts();

  const abs = (path: string) => `${SITE_URL}${localePath(locale, path)}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.nav.home, item: abs("/") },
      { "@type": "ListItem", position: 2, name: dict.nav.blog, item: abs("/blog") },
    ],
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: dict.meta.pages.blog.title,
    description: dict.meta.pages.blog.description,
    url: abs("/blog"),
    inLanguage: locale === "en" ? "en" : "fa",
  };

  return (
    <>
      <JsonLd data={[blogSchema, breadcrumb]} />

      <PageHeader
        eyebrow={dict.blog.eyebrow}
        title={
          <>
            {dict.blog.titleTop}
            <br />
            <span className="text-gradient">{dict.blog.titleBottom}</span>
          </>
        }
        description={dict.blog.description}
      />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {posts.length > 0 ? (
          <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <RevealItem key={post.id}>
                <PostCard post={post} locale={locale} dict={dict.blog} priority={i < 3} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="text-fog-500 glass mt-10 rounded-3xl p-12 text-center">
            {dict.blog.empty}
          </p>
        )}
      </section>

      <CTA locale={locale} dict={dict.cta} />
    </>
  );
}

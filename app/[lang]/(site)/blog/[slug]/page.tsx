import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CTA } from "@/components/site/cta";
import { JsonLd } from "@/components/site/json-ld";
import { PostCard } from "@/components/site/post-card";
import { Eyebrow } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n";
import {
  buildAlternates,
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_META,
  localePath,
  SITE_URL,
} from "@/lib/i18n/config";
import { renderMarkdown } from "@/lib/markdown";
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/lib/posts";
import { decodeParam, formatDate, localizePost } from "@/lib/utils";

type Params = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const post = await getPostBySlug(decodeParam(slug));
  const dict = getDictionary(locale);

  if (!post || !post.published) return { title: dict.projectPage.notFoundTitle };

  const t = localizePost(post, locale);
  const path = `/blog/${post.slug}`;

  return {
    title: t.title,
    description: t.excerpt,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: "article",
      title: t.title,
      description: t.excerpt,
      locale: LOCALE_META[locale].ogLocale,
      url: localePath(locale, path),
      publishedTime: post.publishedAt ?? undefined,
      authors: ["Hirad Code"],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const post = await getPostBySlug(decodeParam(slug));
  if (!post || !post.published) notFound();

  const t = localizePost(post, locale);
  const html = renderMarkdown(t.content);
  const related = await getRelatedPosts(post);

  const abs = (path: string) => `${SITE_URL}${localePath(locale, path)}`;
  const image = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`
    : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: t.title,
    description: t.excerpt,
    image: image ? [image] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.publishedAt ?? undefined,
    inLanguage: locale === "en" ? "en" : "fa",
    author: { "@type": "Organization", name: "Hirad Code", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Hirad Code",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(`/blog/${post.slug}`) },
    keywords: post.tags.join(", ") || undefined,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.nav.home, item: abs("/") },
      { "@type": "ListItem", position: 2, name: dict.nav.blog, item: abs("/blog") },
      {
        "@type": "ListItem",
        position: 3,
        name: t.title,
        item: abs(`/blog/${post.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumb]} />

      <article>
        <header className="px-6 pt-36 pb-8 sm:pt-44">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Link
                href={localePath(locale, "/blog")}
                className="text-fog-500 hover:text-neon-rose mb-8 inline-flex items-center gap-2 text-sm font-bold transition-colors"
              >
                <span aria-hidden>→</span> {dict.blog.back}
              </Link>
            </Reveal>

            {post.tags.length > 0 && (
              <Reveal delay={0.06}>
                <Eyebrow>{post.tags[0]}</Eyebrow>
              </Reveal>
            )}

            <Reveal delay={0.12}>
              <h1 className="mt-6 text-3xl leading-[1.2] font-extrabold tracking-tight text-balance sm:text-5xl">
                {t.title}
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="text-fog-400 mt-5 text-lg leading-8 text-pretty">
                {t.excerpt}
              </p>
            </Reveal>

            {post.publishedAt && (
              <Reveal delay={0.24}>
                <p className="text-fog-600 mt-6 text-sm">
                  {dict.blog.author} ·{" "}
                  <time dateTime={post.publishedAt}>
                    {formatDate(locale, post.publishedAt)}
                  </time>
                </p>
              </Reveal>
            )}
          </div>
        </header>

        {post.coverImage && (
          <Reveal delay={0.1} y={40}>
            <div className="mx-auto max-w-4xl px-6">
              <div className="glass relative aspect-[16/9] overflow-hidden rounded-3xl p-2">
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <Image
                    src={post.coverImage}
                    alt={t.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <div className="mx-auto max-w-3xl px-6 py-16">
          <div
            className="text-fog-300 max-w-none text-base leading-8 [&_a]:text-neon-rose [&_a]:font-bold [&_a]:underline [&_blockquote]:border-neon-pink/40 [&_blockquote]:text-fog-400 [&_blockquote]:my-6 [&_blockquote]:border-s-2 [&_blockquote]:ps-4 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_figcaption]:text-fog-600 [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figure]:my-6 [&_h2]:text-fog-100 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h3]:text-fog-100 [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h4]:text-fog-100 [&_h4]:mt-6 [&_h4]:font-bold [&_hr]:my-8 [&_hr]:border-white/10 [&_img]:my-6 [&_img]:rounded-2xl [&_li]:leading-8 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:ps-6 [&_p]:my-4 [&_strong]:text-fog-100 [&_strong]:font-bold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6"
            // Author-only Markdown, fully escaped by renderMarkdown before this point.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl border-t border-white/5 px-6 py-20">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {dict.blog.relatedLead}
              <span className="text-gradient">{dict.blog.relatedHighlight}</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Reveal key={item.id}>
                <PostCard post={item} locale={locale} dict={dict.blog} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CTA locale={locale} dict={dict.cta} />
    </>
  );
}

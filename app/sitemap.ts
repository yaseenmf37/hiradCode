import type { MetadataRoute } from "next";

import { LOCALES, localePath, SITE_URL } from "@/lib/i18n/config";
import { getPublishedPosts } from "@/lib/posts";
import { getProjects } from "@/lib/projects";

const abs = (path: string) => `${SITE_URL}${path}`;

/** Both locales of a path, as an hreflang alternates map. */
const languagesFor = (path: string) => ({
  fa: abs(localePath("fa", path)),
  en: abs(localePath("en", path)),
});

const STATIC: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/works", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: abs(localePath(locale, route.path)),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: languagesFor(route.path) },
    })),
  );

  // A missing database shouldn't fail the whole sitemap.
  const projects = await getProjects().catch(() => []);

  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((project) => {
    const path = `/works/${project.slug}`;
    return LOCALES.map((locale) => ({
      url: abs(localePath(locale, path)),
      lastModified: new Date(project.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: languagesFor(path) },
    }));
  });

  const posts = await getPublishedPosts().catch(() => []);

  const postEntries: MetadataRoute.Sitemap = posts.flatMap((post) => {
    const path = `/blog/${post.slug}`;
    return LOCALES.map((locale) => ({
      url: abs(localePath(locale, path)),
      lastModified: new Date(post.publishedAt ?? post.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: languagesFor(path) },
    }));
  });

  return [...staticEntries, ...projectEntries, ...postEntries];
}

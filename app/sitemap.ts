import type { MetadataRoute } from "next";

import { getProjects } from "@/lib/projects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hiradcode.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/works`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];

  // A missing database shouldn't fail the whole sitemap.
  const projects = await getProjects().catch(() => []);

  return [
    ...staticRoutes,
    ...projects.map((project) => ({
      url: `${SITE_URL}/works/${project.slug}`,
      lastModified: new Date(project.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

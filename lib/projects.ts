import "server-only";

import { getStore } from "./db";
import type { Project } from "./types";

export async function getProjects(): Promise<Project[]> {
  return getStore().list();
}

/**
 * Featured first, then topped up with the newest of the rest. The home grid is
 * three columns wide, so returning only the one or two projects that happen to
 * be ticked would leave visible holes in the row.
 */
export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  const filler = projects.filter((p) => !p.featured);

  return [...featured, ...filler].slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return getStore().getBySlug(slug);
}

export async function getProjectById(id: string): Promise<Project | null> {
  return getStore().getById(id);
}

/** Categories actually in use, most-used first. */
export async function getUsedCategories(): Promise<string[]> {
  const projects = await getProjects();
  const counts = new Map<string, number>();

  for (const p of projects) {
    if (!p.category) continue;
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
}

/** The two projects shown as "next up" at the foot of a detail page. */
export async function getRelatedProjects(project: Project, limit = 2): Promise<Project[]> {
  const projects = (await getProjects()).filter((p) => p.id !== project.id);
  const sameCategory = projects.filter((p) => p.category === project.category);
  const rest = projects.filter((p) => p.category !== project.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

import "server-only";

import { getPostStore } from "./db";
import type { Post } from "./types";

export async function getPosts(): Promise<Post[]> {
  return getPostStore().list();
}

/** Only posts that are live — used everywhere on the public site. */
export async function getPublishedPosts(): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.published);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return getPostStore().getBySlug(slug);
}

export async function getPostById(id: string): Promise<Post | null> {
  return getPostStore().getById(id);
}

/** A couple of other published posts to show under an article. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const posts = (await getPublishedPosts()).filter((p) => p.id !== post.id);

  // Prefer posts that share a tag, then fill with the newest of the rest.
  const shared = posts.filter((p) => p.tags.some((t) => post.tags.includes(t)));
  const rest = posts.filter((p) => !shared.includes(p));
  return [...shared, ...rest].slice(0, limit);
}

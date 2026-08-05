"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { deletePostAction, togglePublishAction } from "@/app/admin/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Input } from "@/components/ui/field";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PostsTable({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.title, p.excerpt, ...p.tags].join(" ").toLowerCase().includes(q),
    );
  }, [posts, query]);

  if (posts.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <p className="text-fog-300 text-lg font-bold">هنوز مقاله‌ای نوشته نشده</p>
        <p className="text-fog-500 mx-auto mt-2 max-w-sm text-sm leading-7">
          اولین مقاله را بنویسید تا در بلاگ سایت منتشر شود و به سئوی سایت کمک کند.
        </p>
      </div>
    );
  }

  return (
    <>
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجو در عنوان، خلاصه یا تگ…"
        className="mb-4"
        aria-label="جستجوی مقاله"
      />

      <div className="glass divide-y divide-white/5 overflow-hidden rounded-3xl">
        {visible.map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]"
          >
            <Link
              href={`/admin/blog/${post.id}`}
              className="flex min-w-0 flex-1 items-center gap-4"
            >
              <div className="bg-ink-700 relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{post.title}</p>
                <p className="text-fog-600 mt-0.5 truncate text-xs">
                  {post.tags.length > 0 ? post.tags.join(" • ") : "بدون تگ"}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <form action={togglePublishAction}>
                <input type="hidden" name="id" value={post.id} />
                <button
                  type="submit"
                  title={post.published ? "تبدیل به پیش‌نویس" : "انتشار"}
                  aria-pressed={post.published}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all",
                    post.published
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                      : "text-fog-500 hover:text-fog-200 border-white/10 hover:border-white/25",
                  )}
                >
                  {post.published ? "● منتشرشده" : "○ پیش‌نویس"}
                </button>
              </form>

              {post.published && (
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  title="مشاهده در سایت"
                  className="text-fog-500 hover:text-fog-100 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/5"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                    <path
                      d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}

              <Link
                href={`/admin/blog/${post.id}`}
                title="ویرایش"
                className="text-fog-500 hover:text-fog-100 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/5"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path
                    d="M4 16.5V19a1 1 0 0 0 1 1h2.5L18 9.5a2.5 2.5 0 0 0-3.5-3.5L4 16.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <ConfirmDelete
                action={deletePostAction}
                id={post.id}
                title="حذف مقاله"
                description={`«${post.title}» برای همیشه حذف می‌شود. این کار قابل بازگشت نیست.`}
              />
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <p className="text-fog-500 p-10 text-center text-sm">
            مقاله‌ای با این جستجو پیدا نشد.
          </p>
        )}
      </div>
    </>
  );
}

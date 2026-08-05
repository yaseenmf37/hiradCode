import type { Metadata } from "next";

import { PostsTable } from "@/components/admin/posts-table";
import { Toast } from "@/components/admin/toast";
import { ButtonLink } from "@/components/ui/button";
import { getPosts } from "@/lib/posts";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = { title: "بلاگ" };

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const [posts, params] = await Promise.all([getPosts(), searchParams]);

  return (
    <div className="mx-auto max-w-5xl">
      {params.saved && <Toast message="مقاله ذخیره شد." />}
      {params.deleted && <Toast message="مقاله حذف شد." />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">بلاگ</h1>
          <p className="text-fog-500 mt-2 text-sm">
            {posts.length > 0
              ? `${toFa(posts.length)} مقاله`
              : "هنوز مقاله‌ای نوشته نشده."}
          </p>
        </div>

        <ButtonLink href="/admin/blog/new">نوشتن مقاله</ButtonLink>
      </div>

      <div className="mt-8">
        <PostsTable posts={posts} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostForm } from "@/components/admin/post-form";
import { getPostById } from "@/lib/posts";
import { decodeParam } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(decodeParam(id));
  return { title: post ? `ویرایش ${post.title}` : "مقاله پیدا نشد" };
}

export default async function EditPostPage({ params }: Params) {
  const { id } = await params;
  const post = await getPostById(decodeParam(id));

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/blog"
        className="text-fog-500 hover:text-neon-rose mb-6 inline-block text-xs font-bold transition-colors"
      >
        → بازگشت به بلاگ
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          ویرایش <span className="text-gradient">{post.title}</span>
        </h1>

        {post.published && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="text-fog-500 hover:text-neon-rose text-xs font-bold transition-colors"
          >
            مشاهده در سایت ↗
          </Link>
        )}
      </div>

      <PostForm post={post} />
    </div>
  );
}

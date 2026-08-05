import type { Metadata } from "next";
import Link from "next/link";

import { PostForm } from "@/components/admin/post-form";

export const metadata: Metadata = { title: "نوشتن مقاله" };

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/blog"
        className="text-fog-500 hover:text-neon-rose mb-6 inline-block text-xs font-bold transition-colors"
      >
        → بازگشت به بلاگ
      </Link>

      <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
        نوشتن <span className="text-gradient">مقاله</span>
      </h1>

      <PostForm />
    </div>
  );
}

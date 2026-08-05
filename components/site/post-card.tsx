import Image from "next/image";
import Link from "next/link";

import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { Dictionary } from "@/lib/i18n";
import { type Locale, localePath } from "@/lib/i18n/config";
import type { Post } from "@/lib/types";
import { formatDate, localizePost } from "@/lib/utils";

export function PostCard({
  post,
  locale,
  dict,
  priority = false,
}: {
  post: Post;
  locale: Locale;
  dict: Dictionary["blog"];
  priority?: boolean;
}) {
  const { title, excerpt } = localizePost(post, locale);

  return (
    <SpotlightCard className="group h-full">
      <Link
        href={localePath(locale, `/blog/${post.slug}`)}
        className="flex h-full flex-col"
      >
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="from-ink-900 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              className="text-fog-600 text-[11px] font-bold"
            >
              {formatDate(locale, post.publishedAt)}
            </time>
          )}

          <h3 className="mt-2 text-lg leading-snug font-extrabold tracking-tight">
            {title}
          </h3>

          <p className="text-fog-400 mt-2 line-clamp-3 flex-1 text-sm leading-7">
            {excerpt}
          </p>

          <span className="text-fog-500 group-hover:text-neon-rose mt-5 inline-block text-xs font-bold transition-colors">
            {dict.readMore}
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}

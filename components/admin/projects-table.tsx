"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { deleteProjectAction, toggleFeaturedAction } from "@/app/admin/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Input } from "@/components/ui/field";
import type { Project } from "@/lib/types";
import { cn, toFa } from "@/lib/utils";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((p) =>
      [p.title, p.category, p.client ?? "", ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [projects, query]);

  if (projects.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <p className="text-fog-300 text-lg font-bold">هنوز پروژه‌ای اضافه نشده</p>
        <p className="text-fog-500 mx-auto mt-2 max-w-sm text-sm leading-7">
          اولین نمونه‌کارتان را اضافه کنید تا در صفحه اصلی و صفحه نمونه‌کارها
          نمایش داده شود.
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
        placeholder="جستجو در عنوان، دسته‌بندی، کارفرما یا تگ…"
        className="mb-4"
        aria-label="جستجوی پروژه"
      />

      <div className="glass divide-y divide-white/5 overflow-hidden rounded-3xl">
        {visible.map((project) => (
          <div
            key={project.id}
            className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]"
          >
            <Link
              href={`/admin/projects/${project.id}`}
              className="flex min-w-0 flex-1 items-center gap-4"
            >
              <div className="bg-ink-700 relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
                {project.coverImage && (
                  <Image
                    src={project.coverImage}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
                <span
                  className="absolute inset-x-0 bottom-0 h-1"
                  style={{ background: project.accent }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{project.title}</p>
                <p className="text-fog-600 mt-0.5 truncate text-xs">
                  {project.category}
                  {project.year ? ` • ${toFa(project.year)}` : ""}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <form action={toggleFeaturedAction}>
                <input type="hidden" name="id" value={project.id} />
                <button
                  type="submit"
                  title={project.featured ? "حذف از ویژه‌ها" : "افزودن به ویژه‌ها"}
                  aria-pressed={project.featured}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all",
                    project.featured
                      ? "border-neon-pink/40 bg-neon-pink/15 text-neon-rose"
                      : "text-fog-500 hover:text-fog-200 border-white/10 hover:border-white/25",
                  )}
                >
                  {project.featured ? "★ ویژه" : "☆ ویژه"}
                </button>
              </form>

              <Link
                href={`/works/${project.slug}`}
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

              <Link
                href={`/admin/projects/${project.id}`}
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
                action={deleteProjectAction}
                id={project.id}
                title="حذف پروژه"
                description={`«${project.title}» برای همیشه حذف می‌شود. این کار قابل بازگشت نیست.`}
              />
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <p className="text-fog-500 p-10 text-center text-sm">
            پروژه‌ای با این جستجو پیدا نشد.
          </p>
        )}
      </div>
    </>
  );
}

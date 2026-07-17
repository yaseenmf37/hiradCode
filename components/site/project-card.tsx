import Image from "next/image";
import Link from "next/link";

import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { Project } from "@/lib/types";
import { cn, hexToRgbChannels } from "@/lib/utils";

export function ProjectCard({
  project,
  priority = false,
  className,
}: {
  project: Project;
  priority?: boolean;
  className?: string;
}) {
  const accent = hexToRgbChannels(project.accent);

  return (
    <SpotlightCard className={cn("group h-full", className)}>
      <Link href={`/works/${project.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="bg-ink-700 h-full w-full" />
          )}

          {/* Accent wash + bottom fade so the title always has contrast */}
          <div
            className="absolute inset-0 opacity-60 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-30"
            style={{
              background: `linear-gradient(135deg, rgb(${accent} / 0.7), transparent 70%)`,
            }}
          />
          <div className="from-ink-900 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

          {project.featured && (
            <span className="glass-strong text-fog-100 absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-bold">
              ویژه
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <span
            className="text-[11px] font-bold tracking-wider"
            style={{ color: project.accent }}
          >
            {project.category}
          </span>

          <h3 className="mt-2 text-xl leading-tight font-extrabold tracking-tight">
            {project.title}
          </h3>

          <p className="text-fog-400 mt-2 line-clamp-2 flex-1 text-sm leading-7">
            {project.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-fog-300 rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="text-fog-500 group-hover:text-neon-rose mt-5 inline-flex items-center gap-2 text-sm font-bold transition-colors">
            مشاهده پروژه
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}

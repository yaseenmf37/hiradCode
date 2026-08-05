"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/site/project-card";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Project } from "@/lib/types";
import { cn, fmtNum } from "@/lib/utils";

export function WorksGallery({
  projects,
  categories,
  locale,
  dict,
}: {
  projects: Project[];
  categories: string[];
  locale: Locale;
  dict: Dictionary["gallery"];
}) {
  const ALL = dict.all;
  const [active, setActive] = useState(ALL);

  const filters = useMemo(() => [ALL, ...categories], [ALL, categories]);

  const visible = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
    [projects, active, ALL],
  );

  const countFor = (filter: string) =>
    filter === ALL
      ? projects.length
      : projects.filter((p) => p.category === filter).length;

  if (projects.length === 0) {
    return (
      <div className="glass mt-12 rounded-3xl p-16 text-center">
        <p className="text-fog-300 text-lg font-bold">{dict.emptyTitle}</p>
        <p className="text-fog-500 mt-2 text-sm">{dict.emptyBody}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter === active;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-full px-4 py-2.5 text-sm font-bold transition-colors",
                isActive ? "text-white" : "text-fog-400 hover:text-fog-100",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="from-neon-pink to-neon-violet absolute inset-0 rounded-full bg-gradient-to-l"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">
                {filter}
                <span className={cn("ms-1.5 text-[11px]", !isActive && "text-fog-600")}>
                  {fmtNum(locale, countFor(filter))}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={project} locale={locale} dict={dict} priority={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="text-fog-500 glass mt-10 rounded-3xl p-12 text-center">
          {dict.emptyCategory}
        </p>
      )}
    </>
  );
}

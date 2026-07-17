"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/site/project-card";
import type { Project } from "@/lib/types";
import { cn, toFa } from "@/lib/utils";

const ALL = "همه";

export function WorksGallery({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const [active, setActive] = useState(ALL);

  const filters = useMemo(() => [ALL, ...categories], [categories]);

  const visible = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
    [projects, active],
  );

  const countFor = (filter: string) =>
    filter === ALL
      ? projects.length
      : projects.filter((p) => p.category === filter).length;

  if (projects.length === 0) {
    return (
      <div className="glass mt-12 rounded-3xl p-16 text-center">
        <p className="text-fog-300 text-lg font-bold">هنوز پروژه‌ای اضافه نشده</p>
        <p className="text-fog-500 mt-2 text-sm">
          از پنل مدیریت اولین نمونه‌کار را اضافه کنید.
        </p>
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
                  {toFa(countFor(filter))}
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
              <ProjectCard project={project} priority={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="text-fog-500 glass mt-10 rounded-3xl p-12 text-center">
          پروژه‌ای در این دسته‌بندی وجود ندارد.
        </p>
      )}
    </>
  );
}

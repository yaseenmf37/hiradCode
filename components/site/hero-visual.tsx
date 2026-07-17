"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import type { MouseEvent } from "react";

import type { Project } from "@/lib/types";
import { prettyUrl } from "@/lib/utils";

/**
 * Browser frame showing the newest featured project, tilting toward the cursor.
 * Springs keep it from snapping; the whole thing is decorative and hidden from AT.
 */
export function HeroVisual({ project }: { project: Project | null }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springCfg = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], ["9deg", "-9deg"]), springCfg);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], ["-11deg", "11deg"]), springCfg);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="relative [perspective:1400px]"
      aria-hidden
    >
      <div className="from-neon-pink/25 to-neon-violet/25 absolute inset-8 rounded-[3rem] bg-gradient-to-br blur-[70px]" />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass-strong relative overflow-hidden rounded-2xl p-2.5 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9)]"
      >
        {/* Chrome */}
        <div className="mb-2.5 flex items-center gap-2 px-2 pt-1">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-fog-600 mx-auto flex h-6 max-w-[62%] flex-1 items-center justify-center truncate rounded-md bg-black/40 px-3 text-[10px]">
            <span dir="ltr">
              {project?.liveUrl ? prettyUrl(project.liveUrl) : "hiradcode.ir"}
            </span>
          </div>
        </div>

        <div className="relative aspect-[16/11] overflow-hidden rounded-xl">
          {project?.coverImage ? (
            <Image
              src={project.coverImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 46vw"
              className="object-cover"
            />
          ) : (
            <div className="from-neon-pink/40 to-neon-violet/40 h-full w-full bg-gradient-to-br" />
          )}
          <div className="from-ink-900/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

          {project && (
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-neon-rose text-[11px] font-bold">
                {project.category}
              </p>
              <p className="text-fog-100 text-lg font-extrabold">{project.title}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating chips, pushed forward in Z so the tilt reads as depth */}
      <motion.div
        style={{ transform: "translateZ(60px)" }}
        className="glass-strong animate-float absolute -bottom-6 -left-6 rounded-2xl px-4 py-3 shadow-xl"
      >
        <p className="text-fog-500 text-[10px]">نمره Lighthouse</p>
        <p className="text-gradient text-2xl font-extrabold">۹۸</p>
      </motion.div>

      <motion.div
        style={{ transform: "translateZ(60px)" }}
        className="glass-strong animate-float-slow absolute -top-5 -right-5 rounded-2xl px-4 py-3 shadow-xl"
      >
        <p className="text-fog-500 text-[10px]">تحویل پروژه</p>
        <p className="text-gradient text-2xl font-extrabold">۶ هفته</p>
      </motion.div>
    </div>
  );
}

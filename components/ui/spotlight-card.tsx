"use client";

import type { MouseEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Card that tracks the cursor and lights up beneath it. The pointer position is
 * written to CSS vars so the glow is painted by the compositor, not React.
 */
export function SpotlightCard({
  children,
  className,
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={accent ? ({ "--spot": accent } as React.CSSProperties) : undefined}
      className={cn(
        "spotlight glass relative overflow-hidden rounded-3xl transition-all duration-500",
        "hover:-translate-y-1 hover:border-white/20",
        className,
      )}
    >
      {children}
    </div>
  );
}

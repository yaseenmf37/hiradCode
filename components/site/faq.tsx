"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { FAQ } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading
        eyebrow="سوالات پرتکرار"
        title={
          <>
            چیزهایی که معمولاً <span className="text-gradient">می‌پرسند.</span>
          </>
        }
        align="center"
      />

      <div className="mt-12 space-y-3">
        {FAQ.map((item, i) => {
          const isOpen = open === i;

          return (
            <Reveal key={item.question} delay={i * 0.05}>
              <div
                className={cn(
                  "glass overflow-hidden rounded-2xl transition-colors",
                  isOpen && "border-neon-pink/25",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-6 text-start"
                >
                  <span
                    className={cn(
                      "text-sm font-bold transition-colors sm:text-base",
                      isOpen ? "text-fog-100" : "text-fog-300",
                    )}
                  >
                    {item.question}
                  </span>

                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                      isOpen
                        ? "border-neon-pink/40 bg-neon-pink/15 text-neon-rose rotate-45"
                        : "text-fog-500 border-white/10",
                    )}
                    aria-hidden
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1v10M1 6h10"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-fog-400 px-6 pb-6 text-sm leading-8">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

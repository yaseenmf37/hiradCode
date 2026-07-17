import type { ReactNode } from "react";

import { Eyebrow } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <header className="relative px-6 pt-36 pb-4 sm:pt-44">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.16}>
            <p className="text-fog-400 mt-6 max-w-2xl text-base leading-8 text-pretty sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}

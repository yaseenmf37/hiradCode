import Link from "next/link";

import { CTA } from "@/components/site/cta";
import { HeroVisual } from "@/components/site/hero-visual";
import { Marquee } from "@/components/site/marquee";
import { ProjectCard } from "@/components/site/project-card";
import { Eyebrow, SectionHeading } from "@/components/site/section-heading";
import { ServiceIcon } from "@/components/site/service-icon";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SERVICE_META } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/lib/i18n/config";
import { getFeaturedProjects } from "@/lib/projects";
import { fmtNum } from "@/lib/utils";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const featured = await getFeaturedProjects(3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative px-6 pt-36 pb-20 sm:pt-44">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <Eyebrow>{dict.hero.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {dict.hero.titleTop}
                <br />
                <span className="text-gradient">{dict.hero.titleBottom}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-fog-400 mt-6 max-w-lg text-base leading-8 text-pretty sm:text-lg">
                {dict.hero.description}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href={localePath(locale, "/works")} size="lg">
                  {dict.hero.ctaWorks}
                </ButtonLink>
                <ButtonLink
                  href={localePath(locale, "/contact")}
                  variant="outline"
                  size="lg"
                >
                  {dict.hero.ctaContact}
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} y={40}>
            <HeroVisual project={featured[0] ?? null} dict={dict.heroVisual} />
          </Reveal>
        </div>
      </section>

      {/* ── Tech ticker ──────────────────────────────── */}
      <section className="border-y border-white/5">
        <Marquee />
      </section>

      {/* ── Featured work ────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={dict.featured.eyebrow}
            title={
              <>
                {dict.featured.titleTop}
                <br />
                <span className="text-gradient">{dict.featured.titleBottom}</span>
              </>
            }
          />
          <Reveal delay={0.1}>
            <ButtonLink href={localePath(locale, "/works")} variant="outline">
              {dict.featured.all}
            </ButtonLink>
          </Reveal>
        </div>

        {featured.length > 0 ? (
          <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <RevealItem key={project.id}>
                <ProjectCard
                  project={project}
                  locale={locale}
                  dict={dict.gallery}
                  priority={i === 0}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="text-fog-500 glass mt-14 rounded-3xl p-12 text-center">
            {dict.featured.empty}
          </p>
        )}
      </section>

      {/* ── Services ─────────────────────────────────── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow={dict.homeServices.eyebrow}
            title={
              <>
                {dict.homeServices.lead}
                <br />
                <span className="text-gradient">{dict.homeServices.highlight}</span>
                {dict.homeServices.tail}
              </>
            }
            description={dict.homeServices.description}
          />

          <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dict.content.services.map((service, i) => {
              const meta = SERVICE_META[i];
              return (
                <RevealItem key={meta.id}>
                  <Link
                    href={localePath(locale, `/services#${meta.id}`)}
                    className="block h-full"
                  >
                    <SpotlightCard className="group h-full p-7">
                      <ServiceIcon name={meta.icon} />
                      <h3 className="mt-5 text-lg font-extrabold tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-fog-400 mt-2.5 text-sm leading-7">
                        {service.summary}
                      </p>
                      <span className="text-fog-600 group-hover:text-neon-rose mt-5 inline-block text-xs font-bold transition-colors">
                        {dict.homeServices.readMore}
                      </span>
                    </SpotlightCard>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={dict.process.eyebrow}
          title={
            <>
              {dict.process.titleTop}
              <br />
              <span className="text-gradient">{dict.process.titleBottom}</span>
            </>
          }
          description={dict.process.description}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.content.process.map((phase, i) => (
            <Reveal key={phase.title} delay={i * 0.08} className="h-full">
              <div className="glass relative flex h-full flex-col rounded-3xl p-7">
                <span className="text-gradient text-5xl font-extrabold opacity-40">
                  {fmtNum(locale, i + 1)}
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight">
                  {phase.title}
                </h3>
                <p className="text-fog-400 mt-2.5 text-sm leading-7">
                  {phase.description}
                </p>
                {/* mt-auto pins the pill row to the card floor so every pill
                    lines up across cards regardless of description length. */}
                <div className="mt-auto pt-5">
                  <span className="text-neon-rose/70 border-neon-pink/20 bg-neon-pink/5 inline-block rounded-full border px-3 py-1 text-[11px] font-bold">
                    {phase.duration}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow={dict.testimonials.eyebrow}
          title={
            <>
              {dict.testimonials.titleTop}
              <br />
              <span className="text-gradient">{dict.testimonials.titleBottom}</span>
            </>
          }
          align="center"
        />

        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-3">
          {dict.content.testimonials.map((item) => (
            <RevealItem key={item.name}>
              <figure className="glass flex h-full flex-col rounded-3xl p-7">
                <span className="text-neon-pink/30 text-5xl leading-none font-extrabold">
                  ”
                </span>
                <blockquote className="text-fog-300 mt-2 flex-1 text-sm leading-8">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                  <span className="from-neon-pink to-neon-violet flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-extrabold text-white">
                    {item.initial}
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{item.name}</span>
                    <span className="text-fog-600 block text-xs">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CTA locale={locale} dict={dict.cta} />
    </>
  );
}

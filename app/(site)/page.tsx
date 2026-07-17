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
import { PROCESS, SERVICES, TESTIMONIALS } from "@/lib/content";
import { getFeaturedProjects } from "@/lib/projects";
import { SITE } from "@/lib/site-config";

export default async function HomePage() {
  const featured = await getFeaturedProjects(3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative px-6 pt-36 pb-20 sm:pt-44">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <Eyebrow>پذیرش پروژه برای بهار ۱۴۰۴</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                وب‌سایتی می‌سازیم که
                <br />
                <span className="text-gradient">کارفرما را متوقف کند.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-fog-400 mt-6 max-w-lg text-base leading-8 text-pretty sm:text-lg">
                استودیو طراحی و توسعه وب. از هویت بصری تا آخرین خط کد — چیزی
                تحویل می‌دهیم که هم زیباست، هم سریع، و هم واقعاً کار می‌کند.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/works" size="lg">
                  مشاهده نمونه‌کارها
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline" size="lg">
                  شروع پروژه
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
                {SITE.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-gradient text-3xl font-extrabold tracking-tight">
                      {stat.value}
                    </dt>
                    <dd className="text-fog-500 mt-1 text-xs">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.2} y={40}>
            <HeroVisual project={featured[0] ?? null} />
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
            eyebrow="نمونه‌کارها"
            title={
              <>
                کارهایی که به آن‌ها
                <br />
                <span className="text-gradient">افتخار می‌کنیم.</span>
              </>
            }
          />
          <Reveal delay={0.1}>
            <ButtonLink href="/works" variant="outline">
              همه پروژه‌ها
            </ButtonLink>
          </Reveal>
        </div>

        {featured.length > 0 ? (
          <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <RevealItem key={project.id}>
                <ProjectCard project={project} priority={i === 0} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="text-fog-500 glass mt-14 rounded-3xl p-12 text-center">
            هنوز پروژه‌ای اضافه نشده. از پنل مدیریت اولین نمونه‌کار را اضافه کنید.
          </p>
        )}
      </section>

      {/* ── Services ─────────────────────────────────── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="خدمات"
            title={
              <>
                هر چیزی که برای یک حضور
                <br />
                <span className="text-gradient">آنلاین جدی</span> لازم دارید.
              </>
            }
            description="یک تیم، از اول تا آخر. لازم نیست بین چند نفر پاس‌کاری شوید."
            align="center"
          />

          <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <RevealItem key={service.id}>
                <Link href={`/services#${service.id}`} className="block h-full">
                  <SpotlightCard className="group h-full p-7">
                    <ServiceIcon name={service.icon} />
                    <h3 className="mt-5 text-lg font-extrabold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-fog-400 mt-2.5 text-sm leading-7">
                      {service.summary}
                    </p>
                    <span className="text-fog-600 group-hover:text-neon-rose mt-5 inline-block text-xs font-bold transition-colors">
                      بیشتر بخوانید ←
                    </span>
                  </SpotlightCard>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="فرآیند"
          title={
            <>
              بدون غافلگیری،
              <br />
              <span className="text-gradient">بدون ابهام.</span>
            </>
          }
          description="از روز اول می‌دانید کجای کار هستیم، چه چیزی تحویل می‌گیرید و کی."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((phase, i) => (
            <Reveal key={phase.step} delay={i * 0.08}>
              <div className="glass relative h-full rounded-3xl p-7">
                <span className="text-gradient text-5xl font-extrabold opacity-40">
                  {phase.step}
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight">
                  {phase.title}
                </h3>
                <p className="text-fog-400 mt-2.5 text-sm leading-7">
                  {phase.description}
                </p>
                <span className="text-neon-rose/70 border-neon-pink/20 bg-neon-pink/5 mt-5 inline-block rounded-full border px-3 py-1 text-[11px] font-bold">
                  {phase.duration}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="نظر کارفرماها"
          title={
            <>
              حرف ما نه —<span className="text-gradient"> حرف آن‌ها.</span>
            </>
          }
          align="center"
        />

        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
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

      <CTA />
    </>
  );
}

import type { Metadata } from "next";

import { CTA } from "@/components/site/cta";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceIcon } from "@/components/site/service-icon";
import { Reveal } from "@/components/ui/reveal";
import { SERVICE_META } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/metadata";
import { fmtNum } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return pageMeta(locale, "/services", getDictionary(locale).meta.pages.services);
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader
        eyebrow={dict.servicesPage.eyebrow}
        title={
          <>
            {dict.servicesPage.lead}
            <span className="text-gradient">{dict.servicesPage.highlight}</span>
          </>
        }
        description={dict.servicesPage.description}
      />

      {/* ── Services, alternating ────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="space-y-6">
          {dict.content.services.map((service, i) => {
            const meta = SERVICE_META[i];
            return (
              <Reveal key={meta.id} delay={0.04 * i}>
                <article
                  id={meta.id}
                  className="glass grid scroll-mt-28 gap-8 rounded-[2rem] p-8 sm:p-10 lg:grid-cols-[1fr_1fr]"
                >
                  <div>
                    <ServiceIcon name={meta.icon} />
                    <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
                      {service.title}
                    </h2>
                    <p className="text-neon-rose mt-2 text-sm font-bold">
                      {service.summary}
                    </p>
                    <p className="text-fog-400 mt-4 text-sm leading-8">
                      {service.description}
                    </p>
                  </div>

                  <ul className="content-start space-y-3 lg:border-e lg:border-white/5 lg:pe-8">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="border-neon-pink/30 bg-neon-pink/10 text-neon-rose mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold">
                          ✓
                        </span>
                        <span className="text-fog-300 text-sm leading-7">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Process ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeading
          eyebrow={dict.servicesPage.processEyebrow}
          title={
            <>
              {dict.servicesPage.processLead}
              <span className="text-gradient">{dict.servicesPage.processHighlight}</span>
            </>
          }
          align="center"
        />

        <div className="relative mt-16">
          {/* Spine — hidden on mobile where the cards stack. `start-*` so it
              sits under the number circles in both RTL and LTR. */}
          <div className="via-neon-pink/40 absolute inset-y-0 start-[19px] hidden w-px bg-gradient-to-b from-transparent to-transparent sm:block" />

          <div className="space-y-6">
            {dict.content.process.map((phase, i) => {
              const step = fmtNum(locale, i + 1);
              return (
                <Reveal key={phase.title} delay={i * 0.08}>
                  <div className="flex gap-6">
                    <span className="from-neon-pink to-neon-violet relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-extrabold text-white sm:flex">
                      {step}
                    </span>
                    <div className="glass flex-1 rounded-3xl p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-extrabold tracking-tight">
                          <span className="text-gradient sm:hidden">{step} </span>
                          {phase.title}
                        </h3>
                        <span className="text-neon-rose/70 border-neon-pink/20 bg-neon-pink/5 rounded-full border px-3 py-1 text-[11px] font-bold">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-fog-400 mt-3 text-sm leading-7">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTA locale={locale} dict={dict.cta} />
    </>
  );
}

import type { Metadata } from "next";

import { CTA } from "@/components/site/cta";
import { Faq } from "@/components/site/faq";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceIcon } from "@/components/site/service-icon";
import { Reveal } from "@/components/ui/reveal";
import { PROCESS, SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "خدمات",
  description:
    "طراحی رابط کاربری، توسعه وب، هویت بصری، بهینه‌سازی سرعت، سئو تکنیکال و پشتیبانی.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="خدمات"
        title={
          <>
            یک تیم برای
            <br />
            <span className="text-gradient">تمام مسیر.</span>
          </>
        }
        description="لازم نیست برای طراحی سراغ یک نفر بروید، برای کد یک نفر دیگر و برای سئو نفر سوم. همه چیز اینجاست و همه چیز با هم جور است."
      />

      {/* ── Services, alternating ────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="space-y-6">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={0.04 * i}>
              <article
                id={service.id}
                className="glass grid scroll-mt-28 gap-8 rounded-[2rem] p-8 sm:p-10 lg:grid-cols-[1fr_1fr]"
              >
                <div>
                  <ServiceIcon name={service.icon} />
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
          ))}
        </div>
      </section>

      {/* ── Process ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeading
          eyebrow="فرآیند"
          title={
            <>
              چطور کار <span className="text-gradient">پیش می‌رود.</span>
            </>
          }
          align="center"
        />

        <div className="relative mt-16">
          {/* Spine — hidden on mobile where the cards stack */}
          <div className="via-neon-pink/40 absolute inset-y-0 right-[19px] hidden w-px bg-gradient-to-b from-transparent to-transparent sm:block" />

          <div className="space-y-6">
            {PROCESS.map((phase, i) => (
              <Reveal key={phase.step} delay={i * 0.08}>
                <div className="flex gap-6">
                  <span className="from-neon-pink to-neon-violet relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-extrabold text-white sm:flex">
                    {phase.step}
                  </span>
                  <div className="glass flex-1 rounded-3xl p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-extrabold tracking-tight">
                        <span className="text-gradient sm:hidden">{phase.step} </span>
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
            ))}
          </div>
        </div>
      </section>

      <Faq />
      <CTA />
    </>
  );
}

import type { Metadata } from "next";

import { CTA } from "@/components/site/cta";
import { Marquee } from "@/components/site/marquee";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
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
  return pageMeta(locale, "/about", getDictionary(locale).meta.pages.about);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const about = dict.about;

  return (
    <>
      <PageHeader
        eyebrow={about.eyebrow}
        title={
          <>
            {about.titleTop}
            <br />
            <span className="text-gradient">{about.titleBottom}</span>
          </>
        }
        description={about.description}
      />

      {/* ── Story ────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <div className="space-y-5 text-base leading-9">
            {about.story.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "text-fog-200" : "text-fog-400"}>
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-y border-white/5">
        <Marquee />
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <SectionHeading
          eyebrow={about.valuesEyebrow}
          title={
            <>
              {about.valuesLead}
              <span className="text-gradient">{about.valuesHighlight}</span>
            </>
          }
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2">
          {about.values.map((value, i) => (
            <RevealItem key={value.title}>
              <SpotlightCard className="h-full p-8">
                <span className="text-neon-pink/25 text-5xl font-extrabold">
                  {fmtNum(locale, i + 1)}
                </span>
                <h3 className="mt-3 text-lg font-extrabold tracking-tight">
                  {value.title}
                </h3>
                <p className="text-fog-400 mt-3 text-sm leading-8">{value.body}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Team ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <SectionHeading
          eyebrow={about.teamEyebrow}
          title={
            <>
              {about.teamLead}
              <span className="text-gradient">{about.teamHighlight}</span>
            </>
          }
          align="center"
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {about.team.map((member) => (
            <RevealItem key={member.name}>
              <div className="glass rounded-3xl p-7 text-center">
                <span className="from-neon-pink to-neon-violet mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-extrabold text-white">
                  {member.initial}
                </span>
                <h3 className="mt-4 text-base font-extrabold">{member.name}</h3>
                <p className="text-fog-500 mt-1 text-xs leading-6">{member.role}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CTA locale={locale} dict={dict.cta} />
    </>
  );
}

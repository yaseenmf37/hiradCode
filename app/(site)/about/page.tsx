import type { Metadata } from "next";

import { CTA } from "@/components/site/cta";
import { Marquee } from "@/components/site/marquee";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SITE } from "@/lib/site-config";
import { cn, toFa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "ما یک استودیو کوچک و متمرکز هستیم. کم پروژه می‌گیریم تا هر کدام را درست تحویل بدهیم.",
};

const VALUES = [
  {
    title: "کم می‌گیریم، خوب تحویل می‌دهیم",
    body: "همزمان روی چند پروژه محدود کار می‌کنیم. این یعنی پروژه شما پشت صف نمی‌ماند و آدم‌هایی که باهاشان جلسه گذاشتید، همان‌هایی هستند که کار را انجام می‌دهند.",
  },
  {
    title: "اگر ایده‌ای بد باشد، می‌گوییم",
    body: "کار ما فقط اجرا کردن نیست. اگر چیزی که خواسته‌اید به ضرر کاربر یا کسب‌وکارتان باشد، دلیلش را می‌گوییم و جایگزین پیشنهاد می‌دهیم. تصمیم آخر با شماست.",
  },
  {
    title: "سرعت یک ویژگی است، نه یک لوکس",
    body: "سایتی که سه ثانیه بالا بیاید، نصف کاربرانش را از دست داده. عملکرد را از روز اول در نظر می‌گیریم، نه به عنوان کاری که آخر کار برسیم.",
  },
  {
    title: "کد را طوری می‌نویسیم که مال شما باشد",
    body: "تمیز، مستند و بدون قفل. اگر فردا خواستید با تیم دیگری ادامه بدهید، هیچ چیزی گروگان ما نیست.",
  },
];

const TEAM = [
  { name: "هیراد", role: "بنیان‌گذار و توسعه‌دهنده ارشد", initial: "ه" },
  { name: "مینا", role: "طراح رابط و تجربه کاربری", initial: "م" },
  { name: "سینا", role: "توسعه‌دهنده فرانت‌اند", initial: "س" },
  { name: "رها", role: "مدیر پروژه", initial: "ر" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="درباره ما"
        title={
          <>
            یک استودیو کوچک
            <br />
            <span className="text-gradient">با وسواس بزرگ.</span>
          </>
        }
        description="ما آژانس نیستیم. تیمی کوچک و متمرکزیم که ترجیح می‌دهد پنج پروژه را عالی تحویل بدهد تا پنجاه پروژه را معمولی."
      />

      {/* ── Story ────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="space-y-5 text-base leading-9">
              <p className="text-fog-200">
                هیراد کد از یک ناامیدی ساده شروع شد: سایت‌های زیادی می‌دیدیم که
                یا قشنگ بودند و کند، یا سریع بودند و زشت. تقریباً هیچ‌کدام هر دو
                نبودند.
              </p>
              <p className="text-fog-400">
                پس تیمی ساختیم که هر دو طرف را جدی بگیرد. طراح‌هایی که می‌دانند
                کدشان چطور اجرا می‌شود و توسعه‌دهنده‌هایی که فرق بین دو پیکسل را
                می‌بینند. نتیجه‌اش این شد که دیگر لازم نیست بین زیبایی و عملکرد
                یکی را انتخاب کنید.
              </p>
              <p className="text-fog-400">
                از آن موقع بیش از {SITE.stats[0].value} پروژه تحویل داده‌ایم — از
                لندینگ استارتاپ‌های تازه‌کار تا سامانه‌های داخلی شرکت‌های بزرگ. هر
                کدام یک مسئله متفاوت بود و هر کدام چیزی به ما یاد داد.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            {/* h-fit: the card sits beside a taller text column and would
                otherwise stretch, stranding the numbers in dead space. */}
            <div className="ring-gradient glass h-fit rounded-[2rem]">
              <dl className="grid grid-cols-2">
                {SITE.stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "px-4 py-7 text-center",
                      i < 2 && "border-b border-white/5",
                      // Column 2 in RTL sits on the left; its inline-start edge
                      // is the divider between the columns.
                      i % 2 === 1 && "border-s border-white/5",
                    )}
                  >
                    <dt className="text-gradient text-3xl font-extrabold tracking-tight">
                      {stat.value}
                    </dt>
                    <dd className="text-fog-500 mt-2 text-[11px] leading-5">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/5">
        <Marquee />
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <SectionHeading
          eyebrow="اصول ما"
          title={
            <>
              چهار چیزی که سرشان <span className="text-gradient">کوتاه نمی‌آییم.</span>
            </>
          }
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2">
          {VALUES.map((value, i) => (
            <RevealItem key={value.title}>
              <SpotlightCard className="h-full p-8">
                <span className="text-neon-pink/25 text-5xl font-extrabold">
                  {toFa(i + 1)}
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
          eyebrow="تیم"
          title={
            <>
              آدم‌هایی که <span className="text-gradient">کار را می‌کنند.</span>
            </>
          }
          align="center"
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
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

      <CTA />
    </>
  );
}

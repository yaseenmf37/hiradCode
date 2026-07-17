import type { Metadata } from "next";

import { ContactForm } from "@/components/site/contact-form";
import { Faq } from "@/components/site/faq";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "تماس",
  description:
    "پروژه‌ای در سر دارید؟ یک پیام بفرستید — جلسه اول رایگان است و هیچ تعهدی ندارد.",
};

const CHANNELS = [
  {
    label: "ایمیل",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    hint: "بهترین راه برای شروع",
  },
  {
    label: "تلفن",
    value: SITE.phone,
    href: `tel:${SITE.phoneRaw}`,
    hint: "شنبه تا چهارشنبه، ۹ تا ۱۸",
  },
  {
    label: "محل",
    value: SITE.address,
    href: null,
    hint: "جلسات حضوری با هماهنگی قبلی",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="تماس"
        title={
          <>
            بیایید درباره پروژه‌تان
            <br />
            <span className="text-gradient">حرف بزنیم.</span>
          </>
        }
        description="فرم را پر کنید یا مستقیم ایمیل بزنید. جلسه اول رایگان است و بعدش هیچ تعهدی ندارید — حتی اگر تصمیم بگیرید با ما کار نکنید."
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              {CHANNELS.map((channel) => {
                const content = (
                  <>
                    <p className="text-fog-600 text-[11px] font-bold">
                      {channel.label}
                    </p>
                    <p
                      className="text-fog-100 mt-1.5 text-sm font-bold"
                      dir={channel.href ? "ltr" : undefined}
                      style={channel.href ? { textAlign: "right" } : undefined}
                    >
                      {channel.value}
                    </p>
                    <p className="text-fog-600 mt-1 text-[11px]">{channel.hint}</p>
                  </>
                );

                return channel.href ? (
                  <a
                    key={channel.label}
                    href={channel.href}
                    className="glass hover:border-neon-pink/30 block rounded-2xl p-5 transition-colors"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={channel.label} className="glass rounded-2xl p-5">
                    {content}
                  </div>
                );
              })}

              <div className="ring-gradient glass rounded-2xl p-5">
                <p className="text-fog-600 text-[11px] font-bold">شبکه‌های اجتماعی</p>
                <div className="mt-3 flex gap-2">
                  {SITE.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="text-fog-400 hover:border-neon-pink/50 hover:text-fog-100 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold transition-all"
                    >
                      {social.short}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Faq />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/site/contact-form";
import { PageHeader } from "@/components/site/page-header";
import { SocialIcon } from "@/components/site/social-icon";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/metadata";
import { SITE } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return pageMeta(locale, "/contact", getDictionary(locale).meta.pages.contact);
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const channels = [
    {
      label: dict.contact.emailLabel,
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      hint: dict.contact.emailHint,
    },
    {
      label: dict.contact.phoneLabel,
      value: SITE.phone,
      href: `tel:${SITE.phoneRaw}`,
      hint: dict.site.hours,
    },
    {
      label: dict.contact.locationLabel,
      value: dict.site.address,
      href: null,
      hint: dict.contact.locationHint,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={dict.contact.eyebrow}
        title={
          <>
            {dict.contact.titleTop}
            <br />
            <span className="text-gradient">{dict.contact.titleBottom}</span>
          </>
        }
        description={dict.contact.description}
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <ContactForm locale={locale} dict={dict.contactForm} />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              {channels.map((channel) => {
                const content = (
                  <>
                    <p className="text-fog-600 text-[11px] font-bold">
                      {channel.label}
                    </p>
                    <p
                      className="text-fog-100 mt-1.5 text-sm font-bold"
                      dir={channel.href ? "ltr" : undefined}
                      style={channel.href ? { textAlign: "start" } : undefined}
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
                <p className="text-fog-600 text-[11px] font-bold">
                  {dict.contact.socialsHeading}
                </p>
                <div className="mt-3 flex gap-2">
                  {SITE.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      title={social.label}
                      className="text-fog-400 hover:border-neon-pink/50 hover:text-fog-100 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all"
                    >
                      <SocialIcon name={social.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <p className="text-fog-500 mt-10 text-center text-sm">
            {dict.contact.faqPrompt}
            <Link
              href={localePath(locale, "/faq")}
              className="text-neon-rose font-bold hover:underline"
            >
              {dict.contact.faqLink}
            </Link>
          </p>
        </Reveal>
      </section>
    </>
  );
}

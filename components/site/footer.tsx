import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { SocialIcon } from "@/components/site/social-icon";
import type { Dictionary } from "@/lib/i18n";
import { type Locale, localePath } from "@/lib/i18n/config";
import { SITE } from "@/lib/site-config";
import { toFa } from "@/lib/utils";

const PAGE_KEYS = ["home", "works", "services", "blog", "about", "faq", "contact"] as const;
const SERVICE_ANCHORS = ["#design", "#development", "#branding", "#performance"];

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const gregorian = new Date().getFullYear();
  const year = locale === "en" ? String(gregorian) : toFa(gregorian - 621); // Gregorian → rough Jamali
  const siteName = locale === "en" ? SITE.nameEn : SITE.name;

  return (
    <footer className="relative mt-24 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Logo locale={locale} />
            <p className="text-fog-500 mt-5 max-w-xs text-sm leading-7">
              {dict.footer.blurb}
            </p>
          </div>

          <div>
            <h3 className="text-fog-100 mb-4 text-sm font-bold">
              {dict.footer.pagesTitle}
            </h3>
            <ul className="space-y-3">
              {PAGE_KEYS.map((key) => {
                const href = localePath(locale, key === "home" ? "/" : `/${key}`);
                return (
                  <li key={key}>
                    <Link
                      href={href}
                      className="text-fog-500 hover:text-neon-rose text-sm transition-colors"
                    >
                      {dict.nav[key]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-fog-100 mb-4 text-sm font-bold">
              {dict.footer.servicesTitle}
            </h3>
            <ul className="space-y-3">
              {dict.footer.servicesLinks.map((label, i) => (
                <li key={label}>
                  <Link
                    href={localePath(locale, `/services${SERVICE_ANCHORS[i]}`)}
                    className="text-fog-500 hover:text-neon-rose text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-fog-100 mb-4 text-sm font-bold">
              {dict.footer.contactTitle}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-fog-500 hover:text-neon-rose transition-colors"
                  dir="ltr"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="text-fog-500 hover:text-neon-rose transition-colors"
                  dir="ltr"
                >
                  {SITE.phone}
                </a>
              </li>
            </ul>

            <div className="mt-5 flex gap-2">
              {SITE.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  title={social.label}
                  className="text-fog-400 hover:border-neon-pink/50 hover:text-fog-100 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10"
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-fog-600 mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs sm:flex-row">
          <p>
            © {year} {siteName} — {dict.footer.rights}
          </p>
          <p>{dict.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}

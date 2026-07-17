import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { SITE } from "@/lib/site-config";
import { toFa } from "@/lib/utils";

const COLUMNS = [
  {
    title: "صفحات",
    links: [
      { href: "/", label: "خانه" },
      { href: "/works", label: "نمونه‌کارها" },
      { href: "/services", label: "خدمات" },
      { href: "/about", label: "درباره ما" },
      { href: "/contact", label: "تماس" },
    ],
  },
  {
    title: "خدمات",
    links: [
      { href: "/services#design", label: "طراحی رابط کاربری" },
      { href: "/services#development", label: "توسعه وب" },
      { href: "/services#branding", label: "هویت بصری" },
      { href: "/services#performance", label: "بهینه‌سازی سرعت" },
    ],
  },
];

export function Footer() {
  const year = toFa(new Date().getFullYear() - 621); // Gregorian → rough Jamali

  return (
    <footer className="relative mt-24 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="text-fog-500 mt-5 max-w-xs text-sm leading-7">
              استودیو طراحی و توسعه وب. از ایده تا اجرا، وب‌سایت‌هایی می‌سازیم که
              کار می‌کنند و دیده می‌شوند.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-fog-100 mb-4 text-sm font-bold">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-fog-500 hover:text-neon-rose text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-fog-100 mb-4 text-sm font-bold">تماس</h3>
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
                  className="text-fog-400 hover:border-neon-pink/50 hover:text-fog-100 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10"
                >
                  <span className="text-xs font-bold">{social.short}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-fog-600 mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs sm:flex-row">
          <p>
            © {year} هیراد کد — تمام حقوق محفوظ است.
          </p>
          <p>ساخته شده با Next.js و کمی وسواس.</p>
        </div>
      </div>
    </footer>
  );
}

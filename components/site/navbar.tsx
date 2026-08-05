"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/site/logo";
import type { Dictionary } from "@/lib/i18n";
import { type Locale, localePath, switchLocalePath } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const ROUTES = [
  { href: "/", key: "home" },
  { href: "/works", key: "works" },
  { href: "/services", key: "services" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["nav"];
}) {
  const rawPathname = usePathname();
  // The proxy serves Persian at prefix-free URLs but renders the internal /fa
  // tree, so usePathname() can report "/fa/..." during prerender. Normalize to
  // the public path so links and active state match the browser after hydration.
  const pathname =
    rawPathname === "/fa"
      ? "/"
      : rawPathname.startsWith("/fa/")
        ? rawPathname.slice(3)
        : rawPathname;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const other: Locale = locale === "fa" ? "en" : "fa";
  const switchHref = switchLocalePath(pathname, other);

  const links = ROUTES.map((route) => ({
    href: localePath(locale, route.href),
    label: dict[route.key],
    root: route.href,
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route change closes the sheet. Adjusting during render (rather than in an
  // effect) avoids a second render pass with the menu still open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Body lock keeps the page from scrolling behind the open sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const homeHref = localePath(locale, "/");
  const isActive = (href: string, root: string) =>
    root === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <nav
          className={cn(
            "mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full px-5 transition-all duration-500 sm:px-6",
            scrolled
              ? "glass-strong shadow-[0_8px_40px_-12px_rgb(0_0_0/0.8)]"
              : "border border-transparent bg-transparent",
          )}
        >
          <Link href={homeHref} className="shrink-0" aria-label={dict.homeAria}>
            <Logo locale={locale} />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href, link.root)
                    ? "text-fog-100"
                    : "text-fog-400 hover:text-fog-100",
                )}
              >
                {isActive(link.href, link.root) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={switchHref}
              hrefLang={other}
              className="text-fog-300 hover:border-neon-pink/50 hover:text-fog-100 hidden items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold transition-all sm:inline-flex"
            >
              {dict.switchLabel}
            </Link>

            <Link
              href={localePath(locale, "/contact")}
              className="from-neon-violet to-neon-purple hidden rounded-full bg-gradient-to-l px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_30px_-8px_rgb(176_38_255/0.7)] transition-all hover:brightness-110 sm:inline-flex"
            >
              {dict.cta}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? dict.closeMenu : dict.openMenu}
              aria-expanded={open}
              className="text-fog-100 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
            >
              <span className="relative block h-3.5 w-4">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-all duration-300",
                    open && "top-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-1.5 h-0.5 rounded bg-current transition-all duration-300",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-3 h-0.5 rounded bg-current transition-all duration-300",
                    open && "top-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-void/95 fixed inset-0 z-40 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col justify-center gap-2 px-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block border-b border-white/5 py-4 text-3xl font-bold transition-colors",
                      isActive(link.href, link.root) ? "text-gradient" : "text-fog-300",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex items-center gap-3"
              >
                <Link
                  href={localePath(locale, "/contact")}
                  className="from-neon-violet to-neon-purple flex h-14 flex-1 items-center justify-center rounded-full bg-gradient-to-l text-base font-bold text-white"
                >
                  {dict.cta}
                </Link>
                <Link
                  href={switchHref}
                  hrefLang={other}
                  className="text-fog-200 flex h-14 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-base font-bold"
                >
                  {dict.switchLabel}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

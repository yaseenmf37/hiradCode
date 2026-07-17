"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { logoutAction } from "@/app/admin/actions";
import { Logo } from "@/components/site/logo";
import { cn, toFa } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: "M4 13h7V4H4v9Zm9 7h7v-9h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z" },
  { href: "/admin/projects", label: "نمونه‌کارها", icon: "M4 7h16M4 12h16M4 17h10" },
  { href: "/admin/messages", label: "پیام‌ها", icon: "M4 6h16v12H4zM4 7l8 6 8-6" },
];

function NavLinks({ unread }: { unread: number }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors",
              active ? "text-white" : "text-fog-400 hover:bg-white/5 hover:text-fog-100",
            )}
          >
            {active && (
              <motion.span
                layoutId="admin-nav"
                className="from-neon-pink to-neon-violet absolute inset-0 rounded-2xl bg-gradient-to-l"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <svg
              viewBox="0 0 24 24"
              className="relative z-10 h-4.5 w-4.5 shrink-0"
              fill="none"
              aria-hidden
            >
              <path
                d={item.icon}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative z-10">{item.label}</span>

            {item.href === "/admin/messages" && unread > 0 && (
              <span
                className={cn(
                  "relative z-10 ms-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold",
                  active ? "bg-white/25 text-white" : "bg-neon-pink text-white",
                )}
              >
                {toFa(unread)}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ unread }: { unread: number }) {
  return (
    <>
      <Link href="/admin" className="mb-8 block">
        <Logo />
      </Link>

      <NavLinks unread={unread} />

      <div className="mt-auto space-y-1 border-t border-white/5 pt-4">
        <Link
          href="/"
          target="_blank"
          className="text-fog-400 hover:text-fog-100 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors hover:bg-white/5"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
            <path
              d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          مشاهده سایت
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="text-fog-400 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
              <path
                d="M14 8V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2M9 12h11m0 0-3-3m3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            خروج
          </button>
        </form>
      </div>
    </>
  );
}

export function AdminShell({
  children,
  unread,
  hasDatabase,
  isReadOnly,
}: {
  children: ReactNode;
  unread: number;
  hasDatabase: boolean;
  isReadOnly: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Route change closes the mobile sheet, adjusted during render rather than in
  // an effect so the sheet never paints open on the new route.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className="bg-void min-h-dvh">
      {/* Soft brand wash — cheaper than the full Aurora for a dense UI */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="bg-neon-pink/8 absolute -top-40 right-0 h-[30rem] w-[30rem] rounded-full blur-[130px]" />
        <div className="bg-neon-violet/8 absolute bottom-0 left-0 h-[30rem] w-[30rem] rounded-full blur-[130px]" />
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="glass sticky top-0 hidden h-dvh w-64 shrink-0 flex-col p-5 lg:flex">
          <SidebarBody unread={unread} />
        </aside>

        {/* Mobile sheet */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                className="glass-strong fixed inset-y-0 right-0 z-50 flex w-72 flex-col p-5 lg:hidden"
              >
                <SidebarBody unread={unread} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          {/* Mobile topbar */}
          <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between px-5 lg:hidden">
            <Link href="/admin">
              <Logo />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
              className="text-fog-100 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          {(!hasDatabase || isReadOnly) && (
            <div
              className={cn(
                "border-b px-6 py-3 text-xs leading-6 font-bold",
                isReadOnly
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-300",
              )}
            >
              {isReadOnly
                ? "پایگاه داده وصل نیست — تغییرات ذخیره نمی‌شوند. متغیر DATABASE_URL را در تنظیمات Vercel اضافه کنید."
                : "حالت توسعه محلی: داده‌ها در پوشه .data/ ذخیره می‌شوند. برای انتشار روی Vercel باید DATABASE_URL تنظیم شود."}
            </div>
          )}

          <main className="p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

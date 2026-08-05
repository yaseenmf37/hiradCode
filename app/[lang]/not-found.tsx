import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { Aurora } from "@/components/ui/aurora";
import { ButtonLink } from "@/components/ui/button";

/**
 * A not-found boundary doesn't receive the `lang` param, so this stays
 * language-neutral: the heading is bilingual and the buttons point at the
 * Persian (default-locale) routes.
 */
export default function NotFound() {
  return (
    <>
      <Aurora />

      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <Link href="/" aria-label="Hirad Code">
          <Logo />
        </Link>

        <p className="text-gradient mt-12 text-8xl font-extrabold tracking-tight sm:text-9xl">
          ۴۰۴
        </p>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
          این صفحه پیدا نشد.
        </h1>
        <p className="text-fog-500 mt-2 text-sm">This page couldn&apos;t be found.</p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">بازگشت به خانه</ButtonLink>
          <ButtonLink href="/works" variant="outline">
            دیدن نمونه‌کارها
          </ButtonLink>
        </div>
      </div>
    </>
  );
}

import { Logo } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";

export default function NotFound() {
  return (
    <>
      <Aurora />

      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <Logo />

        <p className="text-gradient mt-12 text-8xl font-extrabold tracking-tight sm:text-9xl">
          ۴۰۴
        </p>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
          این صفحه پیدا نشد.
        </h1>

        <p className="text-fog-400 mt-4 max-w-sm text-sm leading-8">
          شاید آدرس را اشتباه وارد کرده‌اید، یا صفحه‌ای که دنبالش بودید جابه‌جا
          شده است.
        </p>

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

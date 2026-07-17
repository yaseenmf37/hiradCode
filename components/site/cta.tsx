import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/site-config";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="ring-gradient glass relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center sm:px-16">
          <div className="bg-neon-pink/20 absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-[100px]" />
          <div className="bg-neon-violet/20 absolute -bottom-24 left-1/4 h-64 w-64 rounded-full blur-[100px]" />

          <div className="relative">
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
              پروژه‌ای در سر دارید؟
              <br />
              <span className="text-gradient">بیایید بسازیمش.</span>
            </h2>

            <p className="text-fog-400 mx-auto mt-5 max-w-lg text-base leading-8 text-pretty">
              یک پیام بفرستید و در کمتر از ۲۴ ساعت جواب می‌گیرید. جلسه اول رایگان
              است و هیچ تعهدی هم ندارید.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contact" size="lg">
                شروع گفتگو
              </ButtonLink>
              <ButtonLink href="/works" variant="outline" size="lg">
                دیدن نمونه‌کارها
              </ButtonLink>
            </div>

            <a
              href={`mailto:${SITE.email}`}
              dir="ltr"
              className="text-fog-500 hover:text-neon-rose mt-8 inline-block text-sm transition-colors"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

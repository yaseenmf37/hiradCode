import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/site/project-card";
import { Eyebrow } from "@/components/site/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getProjectBySlug, getProjects, getRelatedProjects } from "@/lib/projects";
import { decodeParam, hexToRgbChannels, prettyUrl, toFa } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(decodeParam(slug));

  if (!project) return { title: "پروژه پیدا نشد" };

  return {
    title: project.title,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(decodeParam(slug));

  if (!project) notFound();

  const related = await getRelatedProjects(project);
  const accent = hexToRgbChannels(project.accent);

  const meta = [
    { label: "کارفرما", value: project.client },
    { label: "سال", value: project.year ? toFa(project.year) : null },
    { label: "مدت", value: project.duration },
    { label: "نقش ما", value: project.role },
  ].filter((item) => item.value);

  return (
    <>
      {/* Accent bloom keyed to the project's own colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]"
        style={{
          background: `radial-gradient(ellipse 60% 100% at 50% 0%, rgb(${accent} / 0.18), transparent 70%)`,
        }}
      />

      <header className="px-6 pt-36 pb-10 sm:pt-44">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Link
              href="/works"
              className="text-fog-500 hover:text-neon-rose mb-8 inline-flex items-center gap-2 text-sm font-bold transition-colors"
            >
              <span aria-hidden>→</span> بازگشت به نمونه‌کارها
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <Eyebrow>{project.category}</Eyebrow>
          </Reveal>

          <Reveal delay={0.12}>
            <h1 className="mt-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-6xl">
              {project.title}
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="text-fog-400 mt-5 max-w-2xl text-lg leading-8 text-pretty">
              {project.subtitle}
            </p>
          </Reveal>

          {project.liveUrl && (
            <Reveal delay={0.24}>
              <div className="mt-8">
                <ButtonLink
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  size="lg"
                >
                  مشاهده سایت زنده
                  <span dir="ltr" className="text-xs font-normal opacity-70">
                    {prettyUrl(project.liveUrl)}
                  </span>
                </ButtonLink>
              </div>
            </Reveal>
          )}
        </div>
      </header>

      {/* ── Cover ────────────────────────────────────── */}
      {project.coverImage && (
        <Reveal delay={0.1} y={40}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="glass relative aspect-[16/9] overflow-hidden rounded-3xl p-2">
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ── Meta + narrative ─────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <Reveal>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                درباره این پروژه
              </h2>
              <p className="text-fog-300 mt-5 text-base leading-9 whitespace-pre-line">
                {project.description}
              </p>

              {project.services.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-fog-500 text-xs font-bold tracking-wider">
                    خدمات ارائه‌شده
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <li
                        key={service}
                        className="text-fog-200 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>

          {meta.length > 0 && (
            <Reveal delay={0.1}>
              <aside className="glass h-fit rounded-3xl p-6">
                <dl className="space-y-5">
                  {meta.map((item) => (
                    <div key={item.label}>
                      <dt className="text-fog-600 text-xs font-bold">{item.label}</dt>
                      <dd className="text-fog-100 mt-1 text-sm font-bold">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {project.tags.length > 0 && (
                  <div className="mt-6 border-t border-white/5 pt-5">
                    <dt className="text-fog-600 mb-3 text-xs font-bold">تکنولوژی</dt>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                          style={{
                            background: `rgb(${accent} / 0.12)`,
                            color: project.accent,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Results ──────────────────────────────────── */}
      {project.results.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <Reveal>
            <div
              className="ring-gradient glass relative overflow-hidden rounded-[2rem] p-10"
              style={{ background: `rgb(${accent} / 0.04)` }}
            >
              <h2 className="text-fog-500 mb-8 text-xs font-bold tracking-wider">
                نتیجه
              </h2>
              <dl className="grid gap-8 sm:grid-cols-3">
                {project.results.map((result) => (
                  <div key={result.label}>
                    <dt
                      className="text-4xl font-extrabold tracking-tight"
                      style={{ color: project.accent }}
                    >
                      {result.value}
                    </dt>
                    <dd className="text-fog-400 mt-2 text-sm">{result.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Gallery ──────────────────────────────────── */}
      {project.gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-2">
            {project.gallery.map((src, i) => (
              <Reveal key={src} delay={i * 0.08} y={36}>
                <div className="glass relative aspect-[4/3] overflow-hidden rounded-3xl p-2">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src={src}
                      alt={`${project.title} — تصویر ${toFa(i + 1)}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Related ──────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl border-t border-white/5 px-6 py-20">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight">
              پروژه‌های <span className="text-gradient">بعدی</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <ProjectCard project={item} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { getMessageStore } from "@/lib/db";
import { getProjects } from "@/lib/projects";
import { toFa } from "@/lib/utils";

export default async function DashboardPage() {
  const [projects, messages] = await Promise.all([
    getProjects(),
    getMessageStore()
      .list()
      .catch(() => []),
  ]);

  const unread = messages.filter((m) => !m.read).length;

  const stats = [
    { label: "کل پروژه‌ها", value: projects.length, href: "/admin/projects" },
    {
      label: "پروژه ویژه",
      value: projects.filter((p) => p.featured).length,
      href: "/admin/projects",
    },
    { label: "پیام خوانده‌نشده", value: unread, href: "/admin/messages" },
    { label: "کل پیام‌ها", value: messages.length, href: "/admin/messages" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            خوش <span className="text-gradient">آمدید</span>
          </h1>
          <p className="text-fog-500 mt-2 text-sm">
            نمونه‌کارها و پیام‌های سایت را از اینجا مدیریت کنید.
          </p>
        </div>

        <ButtonLink href="/admin/projects/new">افزودن پروژه</ButtonLink>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass hover:border-neon-pink/30 rounded-3xl p-6 transition-colors"
          >
            <p className="text-gradient text-4xl font-extrabold tracking-tight">
              {toFa(stat.value)}
            </p>
            <p className="text-fog-500 mt-1.5 text-xs">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* ── Recent projects ──────────────────────────── */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">آخرین پروژه‌ها</h2>
          <Link
            href="/admin/projects"
            className="text-fog-500 hover:text-neon-rose text-xs font-bold transition-colors"
          >
            همه ←
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-fog-300 font-bold">هنوز پروژه‌ای اضافه نکرده‌اید</p>
            <p className="text-fog-500 mt-2 text-sm">
              اولین نمونه‌کارتان را اضافه کنید تا در سایت نمایش داده شود.
            </p>
            <div className="mt-6 flex justify-center">
              <ButtonLink href="/admin/projects/new">افزودن پروژه</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="glass divide-y divide-white/5 overflow-hidden rounded-3xl">
            {projects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-white/5"
              >
                <div className="bg-ink-700 relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                  {project.coverImage && (
                    <Image
                      src={project.coverImage}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{project.title}</p>
                  <p className="text-fog-600 truncate text-xs">{project.category}</p>
                </div>

                {project.featured && (
                  <span className="bg-neon-pink/15 text-neon-rose rounded-full px-2.5 py-1 text-[10px] font-bold">
                    ویژه
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Recent messages ──────────────────────────── */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">آخرین پیام‌ها</h2>
          <Link
            href="/admin/messages"
            className="text-fog-500 hover:text-neon-rose text-xs font-bold transition-colors"
          >
            همه ←
          </Link>
        </div>

        {messages.length === 0 ? (
          <p className="glass text-fog-500 rounded-3xl p-8 text-center text-sm">
            هنوز پیامی دریافت نشده.
          </p>
        ) : (
          <div className="glass divide-y divide-white/5 overflow-hidden rounded-3xl">
            {messages.slice(0, 4).map((message) => (
              <Link
                key={message.id}
                href="/admin/messages"
                className="flex items-center gap-4 p-4 transition-colors hover:bg-white/5"
              >
                {!message.read && (
                  <span className="bg-neon-pink h-2 w-2 shrink-0 rounded-full" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{message.name}</p>
                  <p className="text-fog-600 truncate text-xs">{message.subject}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

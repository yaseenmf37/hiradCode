import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/projects";
import { decodeParam } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(decodeParam(id));
  return { title: project ? `ویرایش ${project.title}` : "پروژه پیدا نشد" };
}

export default async function EditProjectPage({ params }: Params) {
  const { id } = await params;
  const project = await getProjectById(decodeParam(id));

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/projects"
        className="text-fog-500 hover:text-neon-rose mb-6 inline-block text-xs font-bold transition-colors"
      >
        → بازگشت به نمونه‌کارها
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          ویرایش <span className="text-gradient">{project.title}</span>
        </h1>

        <Link
          href={`/works/${project.slug}`}
          target="_blank"
          className="text-fog-500 hover:text-neon-rose text-xs font-bold transition-colors"
        >
          مشاهده در سایت ↗
        </Link>
      </div>

      <ProjectForm project={project} />
    </div>
  );
}

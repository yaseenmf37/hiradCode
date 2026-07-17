import type { Metadata } from "next";

import { ProjectsTable } from "@/components/admin/projects-table";
import { Toast } from "@/components/admin/toast";
import { ButtonLink } from "@/components/ui/button";
import { getProjects } from "@/lib/projects";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = { title: "نمونه‌کارها" };

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const [projects, params] = await Promise.all([getProjects(), searchParams]);

  return (
    <div className="mx-auto max-w-5xl">
      {params.saved && <Toast message="پروژه ذخیره شد." />}
      {params.deleted && <Toast message="پروژه حذف شد." />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">نمونه‌کارها</h1>
          <p className="text-fog-500 mt-2 text-sm">
            {projects.length > 0
              ? `${toFa(projects.length)} پروژه در سایت نمایش داده می‌شود.`
              : "هنوز پروژه‌ای اضافه نشده."}
          </p>
        </div>

        <ButtonLink href="/admin/projects/new">افزودن پروژه</ButtonLink>
      </div>

      <div className="mt-8">
        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}

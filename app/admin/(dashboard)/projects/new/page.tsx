import type { Metadata } from "next";
import Link from "next/link";

import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "افزودن پروژه" };

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/projects"
        className="text-fog-500 hover:text-neon-rose mb-6 inline-block text-xs font-bold transition-colors"
      >
        → بازگشت به نمونه‌کارها
      </Link>

      <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
        افزودن <span className="text-gradient">پروژه</span>
      </h1>

      <ProjectForm />
    </div>
  );
}

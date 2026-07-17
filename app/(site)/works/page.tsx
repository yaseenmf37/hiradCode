import type { Metadata } from "next";

import { CTA } from "@/components/site/cta";
import { PageHeader } from "@/components/site/page-header";
import { WorksGallery } from "@/components/site/works-gallery";
import { getProjects, getUsedCategories } from "@/lib/projects";

export const metadata: Metadata = {
  title: "نمونه‌کارها",
  description:
    "مجموعه‌ای از وب‌سایت‌ها، فروشگاه‌ها و سامانه‌هایی که طراحی و توسعه داده‌ایم.",
};

export default async function WorksPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getUsedCategories(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="نمونه‌کارها"
        title={
          <>
            هر پروژه یک مسئله بود.
            <br />
            <span className="text-gradient">این‌ها راه‌حل‌ها هستند.</span>
          </>
        }
        description="از فروشگاه و سامانه تا لندینگ و هویت بصری. روی هر کدام کلیک کنید تا ببینید دقیقاً چه کار کردیم و چه نتیجه‌ای گرفت."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <WorksGallery projects={projects} categories={categories} />
      </section>

      <CTA />
    </>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveProjectAction, type ProjectFormState } from "@/app/admin/actions";
import { GalleryInput, ImageInput } from "@/components/admin/image-input";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ACCENT_PRESETS, CATEGORIES, type Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const initial: ProjectFormState = { status: "idle" };

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-3xl p-6 sm:p-7">
      <div className="mb-6">
        <h2 className="text-base font-extrabold tracking-tight">{title}</h2>
        {hint && <p className="text-fog-600 mt-1 text-xs leading-6">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          در حال ذخیره…
        </>
      ) : isEdit ? (
        "ذخیره تغییرات"
      ) : (
        "افزودن پروژه"
      )}
    </Button>
  );
}

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction] = useActionState(saveProjectAction, initial);
  const isEdit = Boolean(project);

  // Fields the browser can't round-trip natively live in React state and are
  // submitted through hidden inputs.
  const [cover, setCover] = useState(project?.coverImage ?? "");
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);
  const [accent, setAccent] = useState(project?.accent ?? ACCENT_PRESETS[0].value);
  const [results, setResults] = useState(
    project?.results.length ? project.results : [{ label: "", value: "" }],
  );

  const setResult = (i: number, key: "label" | "value", next: string) =>
    setResults((rows) =>
      rows.map((row, index) => (index === i ? { ...row, [key]: next } : row)),
    );

  return (
    // noValidate: server-side validation is the single source of truth, so all
    // field errors surface together in Persian rather than one native bubble.
    <form action={formAction} noValidate className="space-y-5">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="coverImage" value={cover} />
      <input type="hidden" name="accent" value={accent} />
      {gallery.map((src, i) => (
        <input key={`${src}-${i}`} type="hidden" name="gallery" value={src} />
      ))}

      {state.status === "error" && state.message && (
        <p className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
          {state.message}
        </p>
      )}

      <Section title="اطلاعات اصلی">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="عنوان پروژه" htmlFor="title" required error={state.errors?.title}>
            <Input
              id="title"
              name="title"
              defaultValue={project?.title}
              placeholder="مثلاً فروشگاه آسترا"
            />
          </Field>

          <Field
            label="نشانی اینترنتی (slug)"
            htmlFor="slug"
            hint="خالی بگذارید تا از روی عنوان ساخته شود"
          >
            <Input
              id="slug"
              name="slug"
              dir="ltr"
              defaultValue={project?.slug}
              placeholder="astra-commerce"
            />
          </Field>

          <Field
            label="توضیح کوتاه"
            htmlFor="subtitle"
            required
            error={state.errors?.subtitle}
            className="sm:col-span-2"
            hint="یک جمله که زیر عنوان و روی کارت نمایش داده می‌شود"
          >
            <Input
              id="subtitle"
              name="subtitle"
              defaultValue={project?.subtitle}
              placeholder="فروشگاه آنلاین با تمرکز کامل روی نرخ تبدیل"
            />
          </Field>

          <Field
            label="دسته‌بندی"
            htmlFor="category"
            required
            error={state.errors?.category}
          >
            <Select id="category" name="category" defaultValue={project?.category ?? ""}>
              <option value="" disabled className="bg-ink-800">
                انتخاب کنید…
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category} className="bg-ink-800">
                  {category}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="لینک سایت زنده" htmlFor="liveUrl">
            <Input
              id="liveUrl"
              name="liveUrl"
              dir="ltr"
              defaultValue={project?.liveUrl ?? ""}
              placeholder="https://example.com"
            />
          </Field>

          <Field
            label="توضیح کامل"
            htmlFor="description"
            required
            error={state.errors?.description}
            className="sm:col-span-2"
            hint="داستان پروژه: مسئله چه بود، چه کردید، چه شد"
          >
            <Textarea
              id="description"
              name="description"
              rows={7}
              defaultValue={project?.description}
              placeholder="کارفرما با این مشکل سراغ ما آمد…"
            />
          </Field>
        </div>
      </Section>

      <Section
        title="تصاویر"
        hint="کاور روی کارت و بالای صفحه پروژه دیده می‌شود. گالری در پایین صفحه."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Field label="تصویر کاور" required error={state.errors?.coverImage}>
            <ImageInput value={cover} onChange={setCover} error={state.errors?.coverImage} />
          </Field>

          <Field label="گالری" hint="اختیاری — هر تعداد تصویر">
            <GalleryInput value={gallery} onChange={setGallery} />
          </Field>
        </div>
      </Section>

      <Section title="جزئیات">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="کارفرما" htmlFor="client">
            <Input id="client" name="client" defaultValue={project?.client ?? ""} />
          </Field>

          <Field label="سال (شمسی)" htmlFor="year" error={state.errors?.year}>
            <Input
              id="year"
              name="year"
              inputMode="numeric"
              defaultValue={project?.year ?? ""}
              placeholder="۱۴۰۳"
            />
          </Field>

          <Field label="مدت پروژه" htmlFor="duration">
            <Input
              id="duration"
              name="duration"
              defaultValue={project?.duration ?? ""}
              placeholder="۶ هفته"
            />
          </Field>

          <Field label="نقش ما" htmlFor="role">
            <Input
              id="role"
              name="role"
              defaultValue={project?.role ?? ""}
              placeholder="طراحی، توسعه فرانت‌اند"
            />
          </Field>

          <Field
            label="تکنولوژی‌ها"
            htmlFor="tags"
            hint="با ویرگول جدا کنید"
            className="sm:col-span-2"
          >
            <Input
              id="tags"
              name="tags"
              defaultValue={project?.tags.join("، ")}
              placeholder="React، TypeScript، فروشگاهی"
            />
          </Field>

          <Field
            label="خدمات ارائه‌شده"
            htmlFor="services"
            hint="با ویرگول جدا کنید"
            className="sm:col-span-2"
          >
            <Input
              id="services"
              name="services"
              defaultValue={project?.services.join("، ")}
              placeholder="طراحی رابط کاربری، توسعه فول‌استک"
            />
          </Field>
        </div>
      </Section>

      <Section
        title="نتایج"
        hint="اعدادی که تاثیر کار را نشان می‌دهند. روی صفحه پروژه بزرگ نمایش داده می‌شوند."
      >
        <div className="space-y-3">
          {results.map((result, i) => (
            <div key={i} className="flex gap-2">
              <Input
                name="resultLabel"
                value={result.label}
                onChange={(e) => setResult(i, "label", e.target.value)}
                placeholder="رشد نرخ تبدیل"
                className="flex-1"
                aria-label={`عنوان نتیجه ${i + 1}`}
              />
              <Input
                name="resultValue"
                value={result.value}
                onChange={(e) => setResult(i, "value", e.target.value)}
                placeholder="٪۶۲"
                className="w-32"
                aria-label={`مقدار نتیجه ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => setResults((rows) => rows.filter((_, index) => index !== i))}
                aria-label="حذف این ردیف"
                className="text-fog-500 shrink-0 rounded-2xl border border-white/10 px-4 text-sm transition-colors hover:border-red-500/40 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setResults((rows) => [...rows, { label: "", value: "" }])}
            className="text-fog-400 hover:border-neon-pink/40 hover:text-fog-100 h-11 w-full rounded-2xl border border-dashed border-white/15 text-xs font-bold transition-colors"
          >
            + افزودن نتیجه
          </button>
        </div>
      </Section>

      <Section title="نمایش">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="رنگ شاخص" hint="روی کارت و صفحه پروژه استفاده می‌شود">
            <div className="flex flex-wrap gap-2">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAccent(preset.value)}
                  title={preset.label}
                  aria-label={preset.label}
                  aria-pressed={accent === preset.value}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition-all",
                    accent === preset.value
                      ? "scale-110 border-white"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                  style={{ background: preset.value }}
                />
              ))}
            </div>
          </Field>

          <Field
            label="ترتیب نمایش"
            htmlFor="sortOrder"
            hint="عدد کوچک‌تر یعنی بالاتر"
          >
            <Input
              id="sortOrder"
              name="sortOrder"
              inputMode="numeric"
              defaultValue={project?.sortOrder ?? 0}
            />
          </Field>

          <label className="glass hover:border-neon-pink/30 flex cursor-pointer items-start gap-3 rounded-2xl p-4 transition-colors sm:col-span-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured}
              className="accent-neon-pink mt-0.5 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-bold">پروژه ویژه</span>
              <span className="text-fog-600 mt-0.5 block text-xs leading-6">
                پروژه‌های ویژه در بخش نمونه‌کارهای صفحه اصلی نمایش داده می‌شوند.
              </span>
            </span>
          </label>
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-5 sm:-mx-8">
        <div className="glass-strong flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link
            href="/admin/projects"
            className="text-fog-500 hover:text-fog-100 text-sm font-bold transition-colors"
          >
            انصراف
          </Link>
          <SubmitButton isEdit={isEdit} />
        </div>
      </div>
    </form>
  );
}

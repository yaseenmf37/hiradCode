"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { savePostAction, type PostFormState } from "@/app/admin/actions";
import { ImageInput } from "@/components/admin/image-input";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import type { Post } from "@/lib/types";

const initial: PostFormState = { status: "idle" };

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
        "افزودن مقاله"
      )}
    </Button>
  );
}

export function PostForm({ post }: { post?: Post }) {
  const [state, formAction] = useActionState(savePostAction, initial);
  const isEdit = Boolean(post);
  const [cover, setCover] = useState(post?.coverImage ?? "");

  return (
    <form action={formAction} noValidate className="space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="coverImage" value={cover} />

      {state.status === "error" && state.message && (
        <p className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
          {state.message}
        </p>
      )}

      <Section title="اطلاعات اصلی">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="عنوان مقاله" htmlFor="title" required error={state.errors?.title}>
            <Input
              id="title"
              name="title"
              defaultValue={post?.title}
              placeholder="مثلاً چطور سایت سریع بسازیم"
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
              defaultValue={post?.slug}
              placeholder="fast-website"
            />
          </Field>

          <Field
            label="خلاصه کوتاه"
            htmlFor="excerpt"
            required
            error={state.errors?.excerpt}
            className="sm:col-span-2"
            hint="یک یا دو جمله که روی کارت و در نتایج گوگل دیده می‌شود"
          >
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt}
              placeholder="در این مقاله می‌بینیم که…"
            />
          </Field>

          <Field
            label="تگ‌ها"
            htmlFor="tags"
            hint="با ویرگول جدا کنید"
            className="sm:col-span-2"
          >
            <Input
              id="tags"
              name="tags"
              defaultValue={post?.tags.join("، ")}
              placeholder="سئو، طراحی وب، Next.js"
            />
          </Field>

          <label className="glass hover:border-neon-pink/30 flex cursor-pointer items-start gap-3 rounded-2xl p-4 transition-colors sm:col-span-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published ?? false}
              className="accent-neon-pink mt-0.5 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-bold">انتشار مقاله</span>
              <span className="text-fog-600 mt-0.5 block text-xs leading-6">
                تا وقتی تیک نخورده، پیش‌نویس است و در سایت دیده نمی‌شود.
              </span>
            </span>
          </label>
        </div>
      </Section>

      <Section
        title="متن مقاله"
        hint="با Markdown بنویسید: ‏## عنوان، ‏### زیرعنوان، ‏- لیست، ‏**پررنگ**، ‏[متن](لینک)، ‏![توضیح](آدرس تصویر)."
      >
        <Field label="متن" htmlFor="content" required error={state.errors?.content}>
          <Textarea
            id="content"
            name="content"
            rows={16}
            defaultValue={post?.content}
            placeholder={"## مقدمه\n\nمتن مقاله را اینجا بنویسید…\n\n## نتیجه‌گیری\n\n- نکته اول\n- نکته دوم"}
          />
        </Field>
      </Section>

      <Section title="تصویر کاور" hint="روی کارت بلاگ و بالای مقاله دیده می‌شود.">
        <ImageInput value={cover} onChange={setCover} />
      </Section>

      <Section
        title="محتوای انگلیسی (اختیاری)"
        hint="برای نسخه انگلیسی (/en/blog). خالی بماند، همان متن فارسی نمایش داده می‌شود."
      >
        <div className="grid gap-5">
          <Field label="عنوان (انگلیسی)" htmlFor="titleEn">
            <Input
              id="titleEn"
              name="titleEn"
              dir="ltr"
              defaultValue={post?.titleEn ?? ""}
              placeholder="e.g. How to build a fast website"
            />
          </Field>

          <Field label="خلاصه (انگلیسی)" htmlFor="excerptEn">
            <Textarea
              id="excerptEn"
              name="excerptEn"
              dir="ltr"
              rows={2}
              defaultValue={post?.excerptEn ?? ""}
              placeholder="In this article we look at…"
            />
          </Field>

          <Field label="متن کامل (انگلیسی)" htmlFor="contentEn">
            <Textarea
              id="contentEn"
              name="contentEn"
              dir="ltr"
              rows={12}
              defaultValue={post?.contentEn ?? ""}
              placeholder={"## Intro\n\nWrite the article here…"}
            />
          </Field>
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-5 sm:-mx-8">
        <div className="glass-strong flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link
            href="/admin/blog"
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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAuthConfigured, isLoggedIn, login, logout } from "@/lib/auth";
import { getMessageStore, getStore } from "@/lib/db";
import type { ProjectInput } from "@/lib/types";

/* ══════════════════════════════════════════════════════
   Server actions are public HTTP endpoints. Every mutating action below
   re-checks the session — the layout guard alone would not protect them.
   ══════════════════════════════════════════════════════ */

async function requireAuth() {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

/** Public pages are statically rendered, so every write must invalidate them. */
function revalidatePublic(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/works");
  if (slug) revalidatePath(`/works/${slug}`);
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

/* ── Auth ──────────────────────────────────────────── */

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return {
      error:
        "ورود پیکربندی نشده است. متغیرهای ADMIN_PASSWORD و AUTH_SECRET را تنظیم کنید.",
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "رمز عبور را وارد کنید." };

  if (!(await login(password))) {
    return { error: "رمز عبور اشتباه است." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

/* ── Projects ──────────────────────────────────────── */

export type ProjectFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Record<string, string>;
};

const str = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

const list = (data: FormData, key: string) =>
  data
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);

/** Accepts "a, b, c" or "a،b،c" — both separators show up in Persian input. */
const csv = (data: FormData, key: string) =>
  str(data, key)
    .split(/[,،]/)
    .map((part) => part.trim())
    .filter(Boolean);

function parseProject(formData: FormData): ProjectInput {
  const labels = list(formData, "resultLabel");
  const values = list(formData, "resultValue");

  const year = str(formData, "year");

  return {
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    subtitle: str(formData, "subtitle"),
    category: str(formData, "category"),
    description: str(formData, "description"),
    coverImage: str(formData, "coverImage"),
    gallery: list(formData, "gallery"),
    liveUrl: str(formData, "liveUrl") || null,
    client: str(formData, "client") || null,
    year: year ? Number(year) : null,
    duration: str(formData, "duration") || null,
    role: str(formData, "role") || null,
    tags: csv(formData, "tags"),
    services: csv(formData, "services"),
    // Pair up only rows where both halves were filled.
    results: labels
      .map((label, i) => ({ label, value: values[i] ?? "" }))
      .filter((r) => r.label && r.value),
    featured: formData.get("featured") === "on",
    accent: str(formData, "accent") || "#ff2e8b",
    sortOrder: Number(str(formData, "sortOrder")) || 0,
  };
}

function validate(input: ProjectInput) {
  const errors: Record<string, string> = {};

  if (input.title.length < 2) errors.title = "عنوان پروژه را وارد کنید.";
  if (!input.category) errors.category = "دسته‌بندی را انتخاب کنید.";
  if (input.subtitle.length < 5) errors.subtitle = "یک توضیح کوتاه وارد کنید.";
  if (input.description.length < 20) {
    errors.description = "توضیح کامل حداقل ۲۰ کاراکتر باشد.";
  }
  if (!input.coverImage) errors.coverImage = "تصویر کاور لازم است.";

  const year = input.year;
  if (year !== null && (!Number.isInteger(year) || year < 1300 || year > 1500)) {
    errors.year = "سال را به شمسی وارد کنید (مثلاً ۱۴۰۳).";
  }

  return errors;
}

export async function saveProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAuth();

  const id = str(formData, "id");
  const input = parseProject(formData);
  const errors = validate(input);

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "چند فیلد نیاز به اصلاح دارند.", errors };
  }

  let slug: string;

  try {
    const saved = id
      ? await getStore().update(id, input)
      : await getStore().create(input);

    if (!saved) return { status: "error", message: "پروژه پیدا نشد." };
    slug = saved.slug;
  } catch (error) {
    console.error("saveProject failed:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "ذخیره پروژه ممکن نشد.",
    };
  }

  revalidatePublic(slug);
  redirect("/admin/projects?saved=1");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await getStore().remove(id);
  revalidatePublic();
  redirect("/admin/projects?deleted=1");
}

export async function toggleFeaturedAction(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  const project = await getStore().getById(id);
  if (!project) return;

  // id/createdAt are server-owned; everything else round-trips unchanged.
  const { id: _id, createdAt: _createdAt, ...rest } = project;
  await getStore().update(id, { ...rest, featured: !project.featured });
  revalidatePublic(project.slug);
}

/* ── Messages ──────────────────────────────────────── */

export async function toggleMessageReadAction(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  const read = formData.get("read") === "true";
  if (!id) return;

  await getMessageStore().setRead(id, read);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessageAction(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await getMessageStore().remove(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

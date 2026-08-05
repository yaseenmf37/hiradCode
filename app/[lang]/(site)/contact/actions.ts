"use server";

import { getMessageStore } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

const str = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const localeRaw = str(formData, "locale");
  const locale = isLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE;
  const t = getDictionary(locale).contactForm;

  // Bots fill hidden fields; humans don't. Reply "sent" so they stop retrying.
  if (str(formData, "company")) return { status: "success" };

  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const budget = str(formData, "budget");
  const body = str(formData, "body");

  // The last subject option ("سایر" / "Other") lets the sender type their own;
  // prefer what they wrote, and fall back to the label if they left it blank.
  const otherOption = t.subjects[t.subjects.length - 1];
  const picked = str(formData, "subject");
  const custom = str(formData, "subjectOther");
  const subject = picked === otherOption && custom ? custom : picked;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = t.errors.name;
  if (!EMAIL_RE.test(email)) errors.email = t.errors.email;
  if (body.length < 10) errors.body = t.errors.body;

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: t.errors.fix, errors };
  }

  try {
    await getMessageStore().create({
      name,
      email,
      phone: phone || null,
      subject: subject || t.noSubject,
      budget: budget || null,
      body,
    });

    return { status: "success", message: t.successMessage };
  } catch (error) {
    console.error("contact submit failed:", error);
    return { status: "error", message: t.errors.sendFail };
  }
}

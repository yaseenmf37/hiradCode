"use server";

import { getMessageStore } from "@/lib/db";
import { SUBJECT_OTHER } from "@/lib/types";

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
  // Bots fill hidden fields; humans don't. Reply "sent" so they stop retrying.
  if (str(formData, "company")) return { status: "success" };

  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const budget = str(formData, "budget");
  const body = str(formData, "body");

  // "سایر" is a placeholder for a subject the sender types themselves; prefer
  // what they wrote, and fall back to the label if they left it blank.
  const picked = str(formData, "subject");
  const custom = str(formData, "subjectOther");
  const subject = picked === SUBJECT_OTHER && custom ? custom : picked;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "نام را وارد کنید.";
  if (!EMAIL_RE.test(email)) errors.email = "ایمیل معتبر وارد کنید.";
  if (body.length < 10) errors.body = "کمی بیشتر توضیح دهید (حداقل ۱۰ کاراکتر).";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "لطفاً خطاهای زیر را برطرف کنید.", errors };
  }

  try {
    await getMessageStore().create({
      name,
      email,
      phone: phone || null,
      subject: subject || "بدون موضوع",
      budget: budget || null,
      body,
    });

    return {
      status: "success",
      message: "پیام شما رسید. کمتر از ۲۴ ساعت دیگر جواب می‌دهیم.",
    };
  } catch (error) {
    console.error("contact submit failed:", error);
    return {
      status: "error",
      message:
        "ارسال پیام ممکن نشد. لطفاً دوباره تلاش کنید یا مستقیم ایمیل بزنید.",
    };
  }
}

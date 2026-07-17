export type ProjectResult = {
  label: string;
  value: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  coverImage: string;
  gallery: string[];
  liveUrl: string | null;
  client: string | null;
  year: number | null;
  duration: string | null;
  role: string | null;
  tags: string[];
  services: string[];
  results: ProjectResult[];
  featured: boolean;
  accent: string;
  sortOrder: number;
  createdAt: string;
};

/** Everything a project needs except server-assigned identity fields. */
export type ProjectInput = Omit<Project, "id" | "createdAt">;

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  budget: string | null;
  body: string;
  read: boolean;
  createdAt: string;
};

export type MessageInput = Omit<Message, "id" | "read" | "createdAt">;

export const BUDGET_RANGES = [
  "زیر ۲۰ میلیون",
  "۲۰ تا ۵۰ میلیون",
  "۵۰ تا ۱۰۰ میلیون",
  "بالای ۱۰۰ میلیون",
  "هنوز نمی‌دانم",
] as const;

/** Picking this reveals a free-text field so the sender can name their own subject. */
export const SUBJECT_OTHER = "سایر";

export const SUBJECTS = [
  "طراحی وب‌سایت جدید",
  "بازطراحی سایت موجود",
  "فروشگاه اینترنتی",
  "هویت بصری و برندینگ",
  SUBJECT_OTHER,
] as const;

export const ACCENT_PRESETS = [
  { label: "صورتی نئون", value: "#ff2e8b" },
  { label: "بنفش", value: "#8b5cf6" },
  { label: "ارغوانی", value: "#a855f7" },
  { label: "رز", value: "#ff6ab8" },
  { label: "نیلی", value: "#6366f1" },
  { label: "فیروزه‌ای", value: "#22d3ee" },
] as const;

export const CATEGORIES = [
  "فروشگاهی",
  "شرکتی",
  "سامانه و داشبورد",
  "لندینگ",
  "شخصی و پورتفولیو",
  "اپلیکیشن وب",
] as const;

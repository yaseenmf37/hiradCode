/** Single place to edit studio contact details and copy that repeats across pages. */
export const SITE = {
  name: "هیراد کد",
  nameEn: "Hirad Code",
  tagline: "استودیو طراحی و توسعه وب",
  email: "hello@hiradcode.ir",
  phone: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
  phoneRaw: "+989123456789",
  address: "تهران، ایران",
  socials: [
    { label: "اینستاگرام", short: "IG", href: "https://instagram.com" },
    { label: "لینکدین", short: "in", href: "https://linkedin.com" },
    { label: "گیت‌هاب", short: "GH", href: "https://github.com" },
    { label: "تلگرام", short: "TG", href: "https://telegram.org" },
  ],
  stats: [
    { value: "۴۵+", label: "پروژه تحویل‌شده" },
    { value: "٪۹۸", label: "رضایت کارفرما" },
    { value: "۶", label: "سال تجربه" },
    { value: "۲۴/۷", label: "پشتیبانی" },
  ],
} as const;

export const TECH_STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Figma",
  "Framer Motion",
  "Vercel",
  "GSAP",
] as const;

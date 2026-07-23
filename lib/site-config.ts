/** Single place to edit studio contact details and copy that repeats across pages. */
export const SITE = {
  name: "هیراد کد",
  nameEn: "Hirad Code",
  tagline: "استودیو طراحی و توسعه وب",
  email: "yaseenmf37@gmail.com",
  phone: "۰۹۳۶ ۱۷۸ ۸۲۲۶",
  phoneRaw: "+989361788226",
  address: "تهران، ایران",
  socials: [
    { label: "اینستاگرام", short: "IG", href: "https://www.instagram.com/hirad_code" },
    { label: "لینکدین", short: "in", href: "https://www.linkedin.com/in/yaseen-mehrani-far-526428343/" },
    { label: "تلگرام", short: "TG", href: "https://t.me/+989361788226" },
    { label: "واتساپ", short: "WA", href: "https://wa.me/989361788226" },
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

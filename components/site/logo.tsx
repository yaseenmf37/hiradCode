import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="from-neon-pink to-neon-violet absolute inset-0 rounded-xl bg-gradient-to-br blur-[10px] opacity-70" />
        <svg
          viewBox="0 0 32 32"
          className="relative h-8 w-8"
          fill="none"
          aria-hidden
        >
          <rect width="32" height="32" rx="9" fill="url(#logo-bg)" />
          <path
            d="M11 22V10M11 16h10M21 10v12"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#ff2e8b" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="text-fog-100 text-lg leading-none font-extrabold tracking-tight">
        هیراد<span className="text-gradient"> کد</span>
      </span>
    </span>
  );
}

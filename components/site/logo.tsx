import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="from-neon-violet to-neon-purple absolute inset-0 rounded-xl bg-gradient-to-br blur-[10px] opacity-70" />
        <svg
          viewBox="0 0 32 32"
          className="relative h-8 w-8"
          fill="none"
          aria-hidden
        >
          <rect width="32" height="32" rx="9" fill="url(#logo-bg)" />
          {/* </> — the code glyph from the Hirad Code mark */}
          <path
            d="M12.5 11 8 16l4.5 5"
            stroke="white"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.5 11 24 16l-4.5 5"
            stroke="white"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.6 9.6 14.4 22.4"
            stroke="white"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#b026ff" />
              <stop offset="1" stopColor="#6a12c2" />
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

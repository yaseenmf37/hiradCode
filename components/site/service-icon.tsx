import type { Service } from "@/lib/content";

const PATHS: Record<Service["icon"], string> = {
  design:
    "M4 16.5V19a1 1 0 0 0 1 1h2.5L18 9.5a2.5 2.5 0 0 0-3.5-3.5L4 16.5ZM13 7l4 4",
  code: "M8.5 8.5 5 12l3.5 3.5M15.5 8.5 19 12l-3.5 3.5M13.5 5.5l-3 13",
  brand:
    "M12 3.5 14.4 9l6 .5-4.6 3.9 1.4 5.9L12 16.1l-5.2 3.2 1.4-5.9L3.6 9.5l6-.5L12 3.5Z",
  speed: "M12 20a8 8 0 1 1 8-8M12 12l4.5-4.5M12 12h.01",
  seo: "M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13ZM15.5 15.5 20 20",
  support:
    "M12 20a8 8 0 1 0-8-8v3.5A2.5 2.5 0 0 0 6.5 18H8M16 18h-.5a2.5 2.5 0 0 1-2.5-2.5V12",
};

export function ServiceIcon({ name }: { name: Service["icon"] }) {
  return (
    <span className="border-neon-pink/20 from-neon-pink/15 to-neon-violet/15 text-neon-rose inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-br">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d={PATHS[name]}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

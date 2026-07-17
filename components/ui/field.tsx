import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const control =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-fog-100 placeholder:text-fog-600 transition-colors focus:border-neon-pink/50 focus:bg-white/[0.06] focus:outline-none disabled:opacity-50";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-fog-300 text-xs font-bold">
        {label}
        {required && <span className="text-neon-pink ms-1">*</span>}
      </label>

      {children}

      {hint && !error && <p className="text-fog-600 text-[11px]">{hint}</p>}
      {error && <p className="text-[11px] font-bold text-red-400">{error}</p>}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}

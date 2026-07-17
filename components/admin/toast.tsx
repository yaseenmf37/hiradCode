"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Shown after a redirect carrying ?saved / ?deleted. Clears the query on dismiss
 * so a refresh doesn't replay the toast.
 */
export function Toast({ message, duration = 3200 }: { message: string; duration?: number }) {
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), duration);
    const clean = setTimeout(() => router.replace(pathname), duration + 350);

    return () => {
      clearTimeout(hide);
      clearTimeout(clean);
    };
  }, [duration, pathname, router]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          role="status"
          className="fixed top-5 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="glass-strong flex items-center gap-3 rounded-full py-3 pe-5 ps-4 shadow-2xl">
            <span className="from-neon-pink to-neon-violet flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-xs text-white">
              ✓
            </span>
            <span className="text-fog-100 text-sm font-bold">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

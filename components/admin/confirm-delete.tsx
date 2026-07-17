"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="danger" disabled={pending} className="flex-1">
      {pending ? "در حال حذف…" : "بله، حذف کن"}
    </Button>
  );
}

/** Trash icon that opens a modal instead of deleting on first click. */
export function ConfirmDelete({
  action,
  id,
  title,
  description,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  title: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="حذف"
        aria-label={title}
        className="text-fog-500 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
          <path
            d="M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              role="dialog"
              aria-modal
              aria-label={title}
              className="fixed inset-x-6 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2"
            >
              <div className="glass-strong rounded-3xl p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10 text-red-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path
                      d="M12 8v5M12 16.5v.01M10.3 4.3 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <h2 className="mt-5 text-lg font-extrabold tracking-tight">{title}</h2>
                <p className="text-fog-400 mt-2 text-sm leading-7">{description}</p>

                <div className="mt-7 flex gap-3">
                  <form action={action} className="flex-1">
                    <input type="hidden" name="id" value={id} />
                    <ConfirmButton />
                  </form>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

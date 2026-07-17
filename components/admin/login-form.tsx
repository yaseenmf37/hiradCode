"use client";

import { motion } from "motion/react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        "ورود"
      )}
    </Button>
  );
}

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      {!configured && (
        <p className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs leading-6 font-bold text-amber-300">
          متغیرهای ADMIN_PASSWORD و AUTH_SECRET تنظیم نشده‌اند. تا زمانی که
          تنظیم نشوند، ورود ممکن نیست.
        </p>
      )}

      <Field label="رمز عبور" htmlFor="password" error={state.error}>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            autoFocus
            className="pe-12"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
            className="text-fog-500 hover:text-fog-200 absolute inset-y-0 end-0 flex w-12 items-center justify-center text-xs font-bold transition-colors"
          >
            {show ? "پنهان" : "نمایش"}
          </button>
        </div>
      </Field>

      {state.error && (
        <motion.div
          initial={{ x: -6 }}
          animate={{ x: [6, -5, 4, -2, 0] }}
          transition={{ duration: 0.4 }}
        />
      )}

      <SubmitButton />
    </form>
  );
}

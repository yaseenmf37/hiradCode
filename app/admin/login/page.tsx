import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/logo";
import { Aurora } from "@/components/ui/aurora";
import { isAuthConfigured, isLoggedIn } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ورود به پنل",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isLoggedIn()) redirect("/admin");

  return (
    <>
      <Aurora />

      <div className="flex min-h-dvh items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="glass ring-gradient rounded-[2rem] p-8">
            <h1 className="text-2xl font-extrabold tracking-tight">
              ورود به <span className="text-gradient">پنل</span>
            </h1>
            <p className="text-fog-500 mt-2 text-sm leading-7">
              برای مدیریت نمونه‌کارها وارد شوید.
            </p>

            <div className="mt-8">
              <LoginForm configured={isAuthConfigured()} />
            </div>
          </div>

          <Link
            href="/"
            className="text-fog-600 hover:text-fog-300 mt-8 block text-center text-xs transition-colors"
          >
            ← بازگشت به سایت
          </Link>
        </div>
      </div>
    </>
  );
}

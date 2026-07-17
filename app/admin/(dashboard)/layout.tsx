import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { isLoggedIn } from "@/lib/auth";
import { getMessageStore, hasDatabase, isReadOnly } from "@/lib/db";

export const metadata: Metadata = {
  title: { default: "پنل مدیریت", template: "%s | پنل مدیریت" },
  robots: { index: false, follow: false },
};

// The session cookie makes every panel route per-request anyway; being explicit
// keeps Next from trying to prerender them at build time.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isLoggedIn())) redirect("/admin/login");

  let unread = 0;
  try {
    unread = (await getMessageStore().list()).filter((m) => !m.read).length;
  } catch {
    // A missing/unreachable database shouldn't blank the whole panel —
    // the banner below already tells the user what's wrong.
  }

  return (
    <AdminShell unread={unread} hasDatabase={hasDatabase} isReadOnly={isReadOnly}>
      {children}
    </AdminShell>
  );
}

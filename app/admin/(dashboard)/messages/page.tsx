import type { Metadata } from "next";

import { MessagesList } from "@/components/admin/messages-list";
import { getMessageStore } from "@/lib/db";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = { title: "پیام‌ها" };

export default async function MessagesPage() {
  const messages = await getMessageStore()
    .list()
    .catch(() => []);

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-extrabold tracking-tight">پیام‌ها</h1>
      <p className="text-fog-500 mt-2 text-sm">
        {messages.length === 0
          ? "هنوز پیامی از فرم تماس دریافت نشده."
          : `${toFa(messages.length)} پیام${unread > 0 ? ` — ${toFa(unread)} خوانده‌نشده` : ""}`}
      </p>

      <div className="mt-8">
        <MessagesList messages={messages} />
      </div>
    </div>
  );
}

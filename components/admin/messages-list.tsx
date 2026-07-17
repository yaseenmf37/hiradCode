"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { deleteMessageAction, toggleMessageReadAction } from "@/app/admin/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import type { Message } from "@/lib/types";
import { cn, toFa } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "همه" },
  { id: "unread", label: "خوانده‌نشده" },
  { id: "read", label: "خوانده‌شده" },
] as const;

function formatDate(iso: string) {
  return toFa(
    new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso)),
  );
}

export function MessagesList({ messages }: { messages: Message[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = messages.filter((m) =>
    filter === "all" ? true : filter === "unread" ? !m.read : m.read,
  );

  if (messages.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <p className="text-fog-300 text-lg font-bold">صندوق خالی است</p>
        <p className="text-fog-500 mx-auto mt-2 max-w-sm text-sm leading-7">
          پیام‌هایی که از فرم تماس سایت ارسال می‌شوند اینجا نمایش داده می‌شوند.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition-all",
              filter === item.id
                ? "from-neon-pink to-neon-violet bg-gradient-to-l text-white"
                : "text-fog-400 hover:text-fog-100 border border-white/10 hover:bg-white/5",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((message) => {
          const isOpen = openId === message.id;

          return (
            <div
              key={message.id}
              className={cn(
                "glass overflow-hidden rounded-2xl transition-colors",
                !message.read && "border-neon-pink/25",
              )}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : message.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 p-4 text-start"
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    message.read ? "bg-fog-600" : "bg-neon-pink",
                  )}
                  aria-hidden
                />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        message.read ? "text-fog-300 font-medium" : "font-extrabold",
                      )}
                    >
                      {message.name}
                    </span>
                    {message.budget && (
                      <span className="bg-neon-violet/15 text-neon-violet rounded-full px-2 py-0.5 text-[10px] font-bold">
                        {message.budget}
                      </span>
                    )}
                  </span>
                  <span className="text-fog-600 mt-0.5 block truncate text-xs">
                    {message.subject}
                  </span>
                </span>

                <span className="text-fog-600 hidden shrink-0 text-[11px] sm:block">
                  {formatDate(message.createdAt)}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="border-t border-white/5 p-5">
                      <dl className="mb-5 grid gap-3 sm:grid-cols-3">
                        <div>
                          <dt className="text-fog-600 text-[10px] font-bold">ایمیل</dt>
                          <dd className="mt-1">
                            <a
                              href={`mailto:${message.email}`}
                              dir="ltr"
                              className="text-neon-rose block truncate text-xs hover:underline"
                              style={{ textAlign: "right" }}
                            >
                              {message.email}
                            </a>
                          </dd>
                        </div>

                        {message.phone && (
                          <div>
                            <dt className="text-fog-600 text-[10px] font-bold">تلفن</dt>
                            <dd className="mt-1">
                              <a
                                href={`tel:${message.phone}`}
                                dir="ltr"
                                className="text-neon-rose block text-xs hover:underline"
                                style={{ textAlign: "right" }}
                              >
                                {message.phone}
                              </a>
                            </dd>
                          </div>
                        )}

                        <div>
                          <dt className="text-fog-600 text-[10px] font-bold">تاریخ</dt>
                          <dd className="text-fog-300 mt-1 text-xs">
                            {formatDate(message.createdAt)}
                          </dd>
                        </div>
                      </dl>

                      <p className="text-fog-200 rounded-2xl bg-white/[0.03] p-4 text-sm leading-8 whitespace-pre-line">
                        {message.body}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${message.email}?subject=${encodeURIComponent(
                            `پاسخ: ${message.subject}`,
                          )}`}
                          className="from-neon-pink to-neon-violet rounded-full bg-gradient-to-l px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-110"
                        >
                          پاسخ با ایمیل
                        </a>

                        <form action={toggleMessageReadAction}>
                          <input type="hidden" name="id" value={message.id} />
                          <input
                            type="hidden"
                            name="read"
                            value={String(!message.read)}
                          />
                          <button
                            type="submit"
                            className="text-fog-400 hover:text-fog-100 rounded-full border border-white/10 px-4 py-2 text-xs font-bold transition-colors hover:bg-white/5"
                          >
                            {message.read
                              ? "علامت‌گذاری خوانده‌نشده"
                              : "علامت‌گذاری خوانده‌شده"}
                          </button>
                        </form>

                        <div className="ms-auto">
                          <ConfirmDelete
                            action={deleteMessageAction}
                            id={message.id}
                            title="حذف پیام"
                            description={`پیام «${message.name}» برای همیشه حذف می‌شود.`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {visible.length === 0 && (
          <p className="glass text-fog-500 rounded-2xl p-10 text-center text-sm">
            پیامی در این دسته وجود ندارد.
          </p>
        )}
      </div>
    </>
  );
}

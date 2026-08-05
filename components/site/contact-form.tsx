"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitContact, type ContactState } from "@/app/[lang]/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

const initial: ContactState = { status: "idle" };

function SubmitButton({ dict }: { dict: Dictionary["contactForm"] }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {dict.submitting}
        </>
      ) : (
        dict.submit
      )}
    </Button>
  );
}

export function ContactForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["contactForm"];
}) {
  const [state, formAction] = useActionState(submitContact, initial);
  const [subject, setSubject] = useState<string>(dict.subjects[0]);
  const otherOption = dict.subjects[dict.subjects.length - 1];

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass ring-gradient rounded-[2rem] p-12 text-center"
      >
        <span className="from-neon-pink to-neon-violet mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-2xl text-white">
          ✓
        </span>
        <h3 className="mt-6 text-2xl font-extrabold tracking-tight">{dict.successTitle}</h3>
        <p className="text-fog-400 mx-auto mt-3 max-w-sm text-sm leading-8">
          {state.message}
        </p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} noValidate className="glass rounded-[2rem] p-8 sm:p-10">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot — visually gone, still fillable by bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 opacity-0"
      />

      <AnimatePresence>
        {state.status === "error" && state.message && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300"
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.name} htmlFor="name" required error={state.errors?.name}>
          <Input id="name" name="name" placeholder={dict.namePh} autoComplete="name" />
        </Field>

        <Field label={dict.email} htmlFor="email" required error={state.errors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            placeholder={dict.emailPh}
            autoComplete="email"
          />
        </Field>

        <Field label={dict.phone} htmlFor="phone" hint={dict.phoneHint}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            placeholder={dict.phonePh}
            autoComplete="tel"
          />
        </Field>

        <Field label={dict.subject} htmlFor="subject">
          <Select
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {dict.subjects.map((option) => (
              <option key={option} value={option} className="bg-ink-800">
                {option}
              </option>
            ))}
          </Select>
        </Field>

        <AnimatePresence initial={false}>
          {subject === otherOption && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="sm:col-span-2"
            >
              <Field
                label={dict.subjectOther}
                htmlFor="subjectOther"
                hint={dict.subjectOtherHint}
              >
                <Input
                  id="subjectOther"
                  name="subjectOther"
                  placeholder={dict.subjectOtherPh}
                />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

        <Field label={dict.budget} htmlFor="budget" className="sm:col-span-2">
          <Select id="budget" name="budget" defaultValue="">
            <option value="" className="bg-ink-800">
              {dict.budgetNone}
            </option>
            {dict.budgets.map((range) => (
              <option key={range} value={range} className="bg-ink-800">
                {range}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={dict.body}
          htmlFor="body"
          required
          error={state.errors?.body}
          className="sm:col-span-2"
        >
          <Textarea id="body" name="body" rows={6} placeholder={dict.bodyPh} />
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <SubmitButton dict={dict} />
        <p className="text-fog-600 text-xs">{dict.replyNote}</p>
      </div>
    </form>
  );
}

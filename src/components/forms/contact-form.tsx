"use client";

import { clsx } from "clsx";
import { useActionState } from "react";

import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState, submitContactAction } from "@/server/actions/public";

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactAction, initialActionState);

  return (
    <div className="card-surface rounded-[2rem] p-6 md:p-8">
      <form action={formAction} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="contact-name">
              Név
            </label>
            <input id="contact-name" name="name" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="contact-email">
              Email
            </label>
            <input id="contact-email" name="email" type="email" className="input-field" />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="contact-phone">
              Telefonszám
            </label>
            <input id="contact-phone" name="phone" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="contact-subject">
              Tárgy
            </label>
            <input id="contact-subject" name="subject" className="input-field" />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-ink" htmlFor="contact-message">
            Üzenet
          </label>
          <textarea id="contact-message" name="message" className="textarea-field" />
        </div>
        {state.message ? (
          <p
            className={clsx(
              "rounded-[1rem] px-4 py-3 text-sm",
              state.status === "success"
                ? "bg-sage/40 text-ink"
                : "bg-red-50 text-red-700",
            )}
          >
            {state.message}
          </p>
        ) : null}
        <SubmitButton idleLabel="Üzenet küldése" pendingLabel="Küldés..." />
      </form>
    </div>
  );
}

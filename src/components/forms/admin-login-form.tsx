"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState, loginAdminAction } from "@/server/actions/public";

export function AdminLoginForm({ previewMode }: { previewMode: boolean }) {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAdminAction, initialActionState);

  useEffect(() => {
    if (state.status === "success") {
      router.push("/admin");
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <div className="card-surface rounded-[2rem] p-8">
      <form action={formAction} className="grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-ink" htmlFor="admin-email">
            Email
          </label>
          <input id="admin-email" name="email" type="email" className="input-field" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-ink" htmlFor="admin-password">
            Jelszó
          </label>
          <input id="admin-password" name="password" type="password" className="input-field" />
        </div>

        {previewMode ? (
          <p className="rounded-[1rem] bg-sage/35 px-4 py-3 text-sm text-ink">
            Preview admin mód aktív. Alapértelmezett demo belépés:{" "}
            <span className="font-semibold">admin@ohm-joga.hu / preview123</span>
          </p>
        ) : null}

        {state.message ? (
          <p
            className={`rounded-[1rem] px-4 py-3 text-sm ${
              state.status === "success"
                ? "bg-sage/35 text-ink"
                : "bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <SubmitButton idleLabel="Belépés" pendingLabel="Beléptetés..." />
      </form>

      <p className="mt-5 text-sm text-stone">
        Vissza a publikus oldalra:{" "}
        <Link href="/" className="font-semibold text-ink">
          Ohm Jóga kezdőlap
        </Link>
      </p>
    </div>
  );
}

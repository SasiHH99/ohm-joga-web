import { hasSupabasePublicEnv } from "@/lib/env";
import { loginAdminServerAction } from "@/server/actions/public";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Admin belépés",
  description: "Supabase Auth alapú admin belépés preview fallback támogatással.",
};

function getErrorMessage(error: string | undefined) {
  switch (error) {
    case "ervenytelen-adatok":
      return "Kérlek adj meg érvényes email címet és jelszót.";
    case "hibas-preview-belepes":
      return "Hibás preview admin belépési adat.";
    case "sikertelen-belepes":
      return "Sikertelen belépés. Ellenőrizd az emailt és a jelszót.";
    case "nincs-supabase":
      return "A Supabase kapcsolat nem érhető el.";
    default:
      return "";
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const error =
    typeof params.error === "string" ? getErrorMessage(params.error) : "";

  return (
    <div className="section-shell flex min-h-screen items-center py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-[2.5rem] border border-white/40 bg-ivory/75 p-8 shadow-[0_30px_120px_rgba(38,35,31,0.08)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
        <div>
          <p className="eyebrow">Admin belépés</p>
          <h1 className="mt-4 font-display text-5xl text-ink">Tiszta adminfelület, tiszta hozzáférés</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-stone">
            Dashboard, foglaláskezelés, órarend admin, blog szerkesztés, kapcsolat üzenetek,
            vélemények és média egy helyen.
          </p>
        </div>
        <div className="card-surface rounded-[2rem] p-8">
          <form action={loginAdminServerAction} className="grid gap-5">
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
              <input
                id="admin-password"
                name="password"
                type="password"
                className="input-field"
              />
            </div>

            {!hasSupabasePublicEnv ? (
              <p className="rounded-[1rem] bg-sage/35 px-4 py-3 text-sm text-ink">
                Preview admin mód aktív. Alapértelmezett demo belépés:
                <span className="font-semibold"> admin@ohm-joga.hu / preview123</span>
              </p>
            ) : null}

            {error ? (
              <p className="rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <Button type="submit">Belépés</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

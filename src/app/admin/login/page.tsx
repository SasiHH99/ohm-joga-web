import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { hasSupabasePublicEnv } from "@/lib/env";

export const metadata = {
  title: "Admin belépés",
  description: "Supabase Auth alapú admin belépés preview fallback támogatással.",
};

export default function AdminLoginPage() {
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
        <AdminLoginForm previewMode={!hasSupabasePublicEnv} />
      </div>
    </div>
  );
}

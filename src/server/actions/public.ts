"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_ADMIN_COOKIE } from "@/lib/auth";
import { env, hasSupabasePublicEnv } from "@/lib/env";
import { createActionSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAdminServerAction(formData: FormData) {
  const payload = {
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  };

  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    redirect("/admin/login?error=ervenytelen-adatok");
  }

  if (!hasSupabasePublicEnv) {
    if (
      parsed.data.email === env.previewAdminEmail &&
      parsed.data.password === env.previewAdminPassword
    ) {
      const cookieStore = await cookies();
      cookieStore.set(PREVIEW_ADMIN_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
      });

      redirect("/admin");
    }

    redirect("/admin/login?error=hibas-preview-belepes");
  }

  const supabase = await createActionSupabaseClient();

  if (!supabase) {
    redirect("/admin/login?error=nincs-supabase");
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect("/admin/login?error=sikertelen-belepes");
  }

  redirect("/admin");
}

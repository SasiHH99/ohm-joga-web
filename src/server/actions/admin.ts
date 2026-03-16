"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_ADMIN_COOKIE } from "@/lib/auth";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function logoutAdminAction() {
  if (!hasSupabasePublicEnv) {
    const cookieStore = await cookies();
    cookieStore.delete(PREVIEW_ADMIN_COOKIE);
    redirect("/admin/login");
  }

  const supabase = await createServerSupabaseClient();
  await supabase!.auth.signOut();
  redirect("/admin/login");
}

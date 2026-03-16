import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env, hasSupabasePublicEnv } from "@/lib/env";
import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
import type { AdminProfile } from "@/lib/types";

export const PREVIEW_ADMIN_COOKIE = "ohm-preview-admin";

export async function getAdminProfile(): Promise<AdminProfile | null> {
  if (!hasSupabasePublicEnv) {
    const cookieStore = await cookies();

    if (cookieStore.get(PREVIEW_ADMIN_COOKIE)?.value === "1") {
      return {
        id: "preview-admin",
        fullName: "Preview Admin",
        email: env.previewAdminEmail,
        role: "owner",
        previewMode: true,
      };
    }

    return null;
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const adminClient = createAdminSupabaseClient();

  if (!adminClient) {
    return null;
  }

  const { data: adminProfile } = await adminClient
    .from("admin_users")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminProfile) {
    return null;
  }

  return {
    id: adminProfile.id,
    fullName: adminProfile.full_name ?? "Admin",
    email: user.email ?? "",
    role: adminProfile.role ?? "editor",
    previewMode: false,
  };
}

export async function requireAdminProfile() {
  const profile = await getAdminProfile();

  if (!profile) {
    redirect("/admin/login");
  }

  return profile;
}

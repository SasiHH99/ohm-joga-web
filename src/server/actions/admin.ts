"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_ADMIN_COOKIE } from "@/lib/auth";
import { hasSupabasePublicEnv, hasSupabaseServiceEnv } from "@/lib/env";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import { blogFormSchema } from "@/lib/validation";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

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

export async function upsertBlogPostAction(formData: FormData) {
  const parsed = blogFormSchema.safeParse({
    id: getString(formData, "id") || undefined,
    slug: getString(formData, "slug"),
    title: getString(formData, "title"),
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    coverImageUrl: getString(formData, "coverImageUrl"),
    categoryId: getString(formData, "categoryId"),
    featured: getCheckbox(formData, "featured"),
    publishedAt: getString(formData, "publishedAt"),
    readTime: getString(formData, "readTime"),
    status: getString(formData, "status"),
    metaTitle: getString(formData, "metaTitle"),
    metaDescription: getString(formData, "metaDescription"),
  });

  if (parsed.success && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin!.from("blog_posts").upsert({
      id: parsed.data.id,
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      cover_image_url: parsed.data.coverImageUrl,
      category_id: parsed.data.categoryId,
      featured: parsed.data.featured ?? false,
      published_at: parsed.data.publishedAt,
      read_time: parsed.data.readTime,
      status: parsed.data.status,
      meta_title: parsed.data.metaTitle,
      meta_description: parsed.data.metaDescription,
    });
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
}

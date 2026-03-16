"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_ADMIN_COOKIE } from "@/lib/auth";
import { hasSupabasePublicEnv, hasSupabaseServiceEnv } from "@/lib/env";
import { addDaysToLocalDateTime, studioLocalDateTimeToIso } from "@/lib/format";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import {
  blogFormSchema,
  calendarDayFormSchema,
  classFormSchema,
} from "@/lib/validation";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getOptionalString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

async function ensureScheduleServiceId() {
  const admin = createAdminSupabaseClient();

  if (!admin) {
    return null;
  }

  const slug = "orarendi-alkalmak";
  const { data: existing } = await admin
    .from("services")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data } = await admin
    .from("services")
    .upsert(
      {
        slug,
        title: "Órarendi alkalmak",
        short_description: "A rendszeres jógaórák technikai gyűjtőeleme.",
        description: "Az adminból kezelt, publikus órarendi események technikai gyűjtőeleme.",
        audience: "Publikus órarend",
        duration_minutes: 75,
        price_label: "Aktuális órarend szerint",
        delivery_mode: "Személyesen",
        is_active: true,
        featured: false,
        sort_order: 1,
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();

  return data?.id ?? null;
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

export async function upsertClassSessionAction(formData: FormData) {
  const parsed = classFormSchema.safeParse({
    id: getOptionalString(formData, "id"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    startsAtLocal: getString(formData, "startsAtLocal"),
    endsAtLocal: getString(formData, "endsAtLocal"),
    locationName: getString(formData, "locationName"),
    locationAddress: getString(formData, "locationAddress"),
    capacity: getString(formData, "capacity"),
    status: getString(formData, "status"),
    isRecurring: getCheckbox(formData, "isRecurring"),
    repeatMode: getString(formData, "repeatMode") || "none",
    repeatCount: getString(formData, "repeatCount") || "1",
  });

  if (parsed.success && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    const serviceId = await ensureScheduleServiceId();

    if (admin && serviceId) {
      if (!parsed.data.id && parsed.data.repeatMode === "weekly" && parsed.data.repeatCount > 1) {
        const payload = Array.from({ length: parsed.data.repeatCount }, (_, index) => ({
          service_id: serviceId,
          title: parsed.data.title,
          description: parsed.data.description,
          starts_at: studioLocalDateTimeToIso(
            addDaysToLocalDateTime(parsed.data.startsAtLocal, index * 7),
          ),
          ends_at: studioLocalDateTimeToIso(
            addDaysToLocalDateTime(parsed.data.endsAtLocal, index * 7),
          ),
          location_name: parsed.data.locationName,
          location_address: parsed.data.locationAddress,
          capacity: parsed.data.capacity,
          status: parsed.data.status,
          is_recurring: true,
        }));

        await admin.from("classes").insert(payload);
      } else {
        await admin.from("classes").upsert({
          id: parsed.data.id,
          service_id: serviceId,
          title: parsed.data.title,
          description: parsed.data.description,
          starts_at: studioLocalDateTimeToIso(parsed.data.startsAtLocal),
          ends_at: studioLocalDateTimeToIso(parsed.data.endsAtLocal),
          location_name: parsed.data.locationName,
          location_address: parsed.data.locationAddress,
          capacity: parsed.data.capacity,
          status: parsed.data.status,
          is_recurring: parsed.data.isRecurring ?? false,
        });
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/orarend");
  revalidatePath("/admin");
  revalidatePath("/admin/orarend");
}

export async function deleteClassSessionAction(formData: FormData) {
  const id = getString(formData, "id");

  if (id && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin?.from("classes").delete().eq("id", id);
  }

  revalidatePath("/");
  revalidatePath("/orarend");
  revalidatePath("/admin");
  revalidatePath("/admin/orarend");
}

export async function upsertCalendarDayAction(formData: FormData) {
  const parsed = calendarDayFormSchema.safeParse({
    id: getOptionalString(formData, "id"),
    day: getString(formData, "day"),
    status: getString(formData, "status"),
    label: getOptionalString(formData, "label"),
    note: getOptionalString(formData, "note"),
  });

  if (parsed.success && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin?.from("calendar_days").upsert({
      id: parsed.data.id,
      day: parsed.data.day,
      status: parsed.data.status,
      label: parsed.data.label ?? "",
      note: parsed.data.note ?? "",
    });
  }

  revalidatePath("/orarend");
  revalidatePath("/admin");
  revalidatePath("/admin/naptar");
}

export async function deleteCalendarDayAction(formData: FormData) {
  const id = getString(formData, "id");

  if (id && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin?.from("calendar_days").delete().eq("id", id);
  }

  revalidatePath("/orarend");
  revalidatePath("/admin");
  revalidatePath("/admin/naptar");
}

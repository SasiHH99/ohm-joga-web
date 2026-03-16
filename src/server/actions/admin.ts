"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_ADMIN_COOKIE } from "@/lib/auth";
import { hasSupabasePublicEnv, hasSupabaseServiceEnv } from "@/lib/env";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import {
  blogFormSchema,
  bookingStatusSchema,
  classFormSchema,
  messageStatusSchema,
  serviceFormSchema,
  testimonialFormSchema,
} from "@/lib/validation";

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

export async function updateBookingStatusAction(formData: FormData) {
  const parsed = bookingStatusSchema.safeParse({
    id: getString(formData, "id"),
    status: getString(formData, "status"),
  });

  if (parsed.success && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin!.from("bookings").update({ status: parsed.data.status }).eq("id", parsed.data.id);
  }

  revalidatePath("/admin/foglalasok");
}

export async function updateMessageStatusAction(formData: FormData) {
  const parsed = messageStatusSchema.safeParse({
    id: getString(formData, "id"),
    status: getString(formData, "status"),
  });

  if (parsed.success && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin!
      .from("contact_messages")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.id);
  }

  revalidatePath("/admin/uzenetek");
}

export async function upsertServiceAction(formData: FormData) {
  const parsed = serviceFormSchema.safeParse({
    id: getString(formData, "id") || undefined,
    slug: getString(formData, "slug"),
    title: getString(formData, "title"),
    shortDescription: getString(formData, "shortDescription"),
    description: getString(formData, "description"),
    audience: getString(formData, "audience"),
    durationMinutes: getString(formData, "durationMinutes"),
    priceLabel: getString(formData, "priceLabel"),
    deliveryMode: getString(formData, "deliveryMode"),
    isActive: getCheckbox(formData, "isActive"),
    featured: getCheckbox(formData, "featured"),
    sortOrder: getString(formData, "sortOrder"),
  });

  if (parsed.success && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin!.from("services").upsert({
      id: parsed.data.id,
      slug: parsed.data.slug,
      title: parsed.data.title,
      short_description: parsed.data.shortDescription,
      description: parsed.data.description,
      audience: parsed.data.audience,
      duration_minutes: parsed.data.durationMinutes,
      price_label: parsed.data.priceLabel,
      delivery_mode: parsed.data.deliveryMode,
      is_active: parsed.data.isActive ?? false,
      featured: parsed.data.featured ?? false,
      sort_order: parsed.data.sortOrder,
    });
  }

  revalidatePath("/szolgaltatasok");
  revalidatePath("/admin/szolgaltatasok");
}

export async function upsertClassAction(formData: FormData) {
  const parsed = classFormSchema.safeParse({
    id: getString(formData, "id") || undefined,
    serviceId: getString(formData, "serviceId"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    startsAt: getString(formData, "startsAt"),
    endsAt: getString(formData, "endsAt"),
    locationName: getString(formData, "locationName"),
    locationAddress: getString(formData, "locationAddress"),
    capacity: getString(formData, "capacity"),
    status: getString(formData, "status"),
    isRecurring: getCheckbox(formData, "isRecurring"),
  });

  if (parsed.success && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin!.from("classes").upsert({
      id: parsed.data.id,
      service_id: parsed.data.serviceId,
      title: parsed.data.title,
      description: parsed.data.description,
      starts_at: parsed.data.startsAt,
      ends_at: parsed.data.endsAt,
      location_name: parsed.data.locationName,
      location_address: parsed.data.locationAddress,
      capacity: parsed.data.capacity,
      status: parsed.data.status,
      is_recurring: parsed.data.isRecurring ?? false,
    });
  }

  revalidatePath("/");
  revalidatePath("/orarend");
  revalidatePath("/admin/orarend");
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
  revalidatePath("/admin/blog");
}

export async function upsertTestimonialAction(formData: FormData) {
  const parsed = testimonialFormSchema.safeParse({
    id: getString(formData, "id") || undefined,
    authorName: getString(formData, "authorName"),
    authorRole: getString(formData, "authorRole"),
    quote: getString(formData, "quote"),
    isVisible: getCheckbox(formData, "isVisible"),
    sortOrder: getString(formData, "sortOrder"),
  });

  if (parsed.success && hasSupabaseServiceEnv) {
    const admin = createAdminSupabaseClient();
    await admin!.from("testimonials").upsert({
      id: parsed.data.id,
      author_name: parsed.data.authorName,
      author_role: parsed.data.authorRole,
      quote: parsed.data.quote,
      is_visible: parsed.data.isVisible ?? false,
      sort_order: parsed.data.sortOrder,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/velemenyek");
}

import { parseISO } from "date-fns";

import { hasSupabasePublicEnv } from "@/lib/env";
import {
  mockBlogPosts,
  mockBookings,
  mockCategories,
  mockClasses,
  mockDashboardStats,
  mockMediaAssets,
  mockMessages,
  mockServices,
  mockSettings,
  mockTestimonials,
} from "@/lib/mock-data";
import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
import type {
  BlogPost,
  Booking,
  ClassSession,
  ContactMessage,
  DashboardStats,
  MediaAsset,
  Service,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

function sortClasses(classes: ClassSession[]) {
  return [...classes].sort(
    (a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
  );
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) => parseISO(b.publishedAt).getTime() - parseISO(a.publishedAt).getTime(),
  );
}

export async function getSettings(): Promise<SiteSettings> {
  if (!hasSupabasePublicEnv) {
    return mockSettings;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase!.from("settings").select("*").limit(1).maybeSingle();

    if (!data) {
      return mockSettings;
    }

    return {
      studioName: data.studio_name,
      tagline: data.tagline,
      description: data.description,
      email: data.email,
      phone: data.phone,
      address: data.address,
      locationName: data.location_name,
      mapEmbedUrl: data.map_embed_url ?? "",
      instagramUrl: data.instagram_url ?? "",
      facebookUrl: data.facebook_url ?? "",
      heroPrimaryCta: data.hero_primary_cta ?? "Órarend megtekintése",
      heroSecondaryCta: data.hero_secondary_cta ?? "Óra foglalása",
    };
  } catch {
    return mockSettings;
  }
}

export async function getServices(includeInactive = false): Promise<Service[]> {
  if (!hasSupabasePublicEnv) {
    return mockServices.filter((service) => includeInactive || service.isActive);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const query = supabase!.from("services").select("*").order("sort_order");
    const { data } = includeInactive ? await query : await query.eq("is_active", true);

    if (!data) {
      return mockServices.filter((service) => includeInactive || service.isActive);
    }

    return data.map((service) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      shortDescription: service.short_description,
      description: service.description,
      audience: service.audience,
      durationMinutes: service.duration_minutes,
      priceLabel: service.price_label,
      deliveryMode: service.delivery_mode,
      isActive: service.is_active,
      featured: service.featured,
      sortOrder: service.sort_order,
    }));
  } catch {
    return mockServices.filter((service) => includeInactive || service.isActive);
  }
}

export async function getClasses(includePast = false): Promise<ClassSession[]> {
  if (!hasSupabasePublicEnv) {
    return sortClasses(mockClasses);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: classes } = await supabase!.from("classes").select("*").order("starts_at");

    if (!classes) {
      return sortClasses(mockClasses);
    }

    const adminSupabase = createAdminSupabaseClient();
    const { data: bookings } = adminSupabase
      ? await adminSupabase
          .from("bookings")
          .select("class_id, status")
          .in("status", ["pending", "confirmed"])
      : { data: [] as Array<{ class_id: string | null }> };

    const bookingsByClass = new Map<string, number>();

    bookings?.forEach((booking) => {
      if (!booking.class_id) return;
      bookingsByClass.set(
        booking.class_id,
        (bookingsByClass.get(booking.class_id) ?? 0) + 1,
      );
    });

    const normalized = classes.map((item) => ({
      id: item.id,
      serviceId: item.service_id,
      title: item.title,
      description: item.description,
      startsAt: item.starts_at,
      endsAt: item.ends_at,
      locationName: item.location_name,
      locationAddress: item.location_address,
      capacity: item.capacity,
      availableSpots: Math.max(item.capacity - (bookingsByClass.get(item.id) ?? 0), 0),
      status: item.status,
      isRecurring: item.is_recurring,
    })) as ClassSession[];

    return includePast
      ? normalized
      : normalized.filter((item) => parseISO(item.startsAt).getTime() >= Date.now());
  } catch {
    return sortClasses(mockClasses);
  }
}

export async function getUpcomingClasses(limit = 3) {
  const classes = await getClasses(false);
  return classes.slice(0, limit);
}

export async function getBookings(): Promise<Booking[]> {
  if (!hasSupabasePublicEnv) {
    return mockBookings;
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase!.from("bookings").select("*").order("created_at", {
      ascending: false,
    });

    if (!data) {
      return mockBookings;
    }

    return data.map((booking) => ({
      id: booking.id,
      serviceId: booking.service_id,
      classId: booking.class_id,
      requestType: booking.request_type,
      preferredDate: booking.preferred_date,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      note: booking.note ?? "",
      status: booking.status,
      privacyAccepted: booking.privacy_accepted,
      createdAt: booking.created_at,
    }));
  } catch {
    return mockBookings;
  }
}

export async function getBlogCategories() {
  if (!hasSupabasePublicEnv) {
    return mockCategories;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase!.from("blog_categories").select("*").order("name");

    if (!data) {
      return mockCategories;
    }

    return data.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
    }));
  } catch {
    return mockCategories;
  }
}

export async function getBlogPosts(options?: {
  category?: string;
  query?: string;
  includeDrafts?: boolean;
}) {
  const category = options?.category?.trim();
  const query = options?.query?.trim().toLowerCase();
  const includeDrafts = options?.includeDrafts ?? false;

  if (!hasSupabasePublicEnv) {
    const posts = sortPosts(mockBlogPosts).filter(
      (post) => includeDrafts || post.status === "published",
    );

    return posts.filter((post) => {
      const matchesCategory = category
        ? mockCategories.find((item) => item.id === post.categoryId)?.slug === category
        : true;
      const matchesQuery = query
        ? `${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(query)
        : true;
      return matchesCategory && matchesQuery;
    });
  }

  try {
    const supabase = await createServerSupabaseClient();
    let request = supabase!.from("blog_posts").select("*").order("published_at", {
      ascending: false,
    });

    if (!includeDrafts) {
      request = request.eq("status", "published");
    }

    if (category) {
      const categories = await getBlogCategories();
      const match = categories.find((item) => item.slug === category);
      if (match) {
        request = request.eq("category_id", match.id);
      }
    }

    const { data } = await request;
    if (!data) {
      return sortPosts(mockBlogPosts);
    }

    const normalized = data.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.cover_image_url,
      categoryId: post.category_id,
      featured: post.featured,
      publishedAt: post.published_at,
      readTime: post.read_time,
      status: post.status,
      metaTitle: post.meta_title,
      metaDescription: post.meta_description,
    })) as BlogPost[];

    if (!query) {
      return normalized;
    }

    return normalized.filter((post) =>
      `${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(query),
    );
  } catch {
    return sortPosts(mockBlogPosts).filter(
      (post) => includeDrafts || post.status === "published",
    );
  }
}

export async function getFeaturedBlogPosts(limit = 3) {
  const posts = await getBlogPosts();
  return posts.filter((post) => post.featured).slice(0, limit);
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPosts({ includeDrafts: true });
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getTestimonials(includeHidden = false): Promise<Testimonial[]> {
  if (!hasSupabasePublicEnv) {
    return mockTestimonials
      .filter((item) => includeHidden || item.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const query = supabase!.from("testimonials").select("*").order("sort_order");
    const { data } = includeHidden ? await query : await query.eq("is_visible", true);

    if (!data) {
      return mockTestimonials;
    }

    return data.map((item) => ({
      id: item.id,
      authorName: item.author_name,
      authorRole: item.author_role,
      quote: item.quote,
      isVisible: item.is_visible,
      sortOrder: item.sort_order,
    }));
  } catch {
    return mockTestimonials.filter((item) => includeHidden || item.isVisible);
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!hasSupabasePublicEnv) {
    return mockMessages;
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase!.from("contact_messages").select("*").order(
      "created_at",
      { ascending: false },
    );

    if (!data) {
      return mockMessages;
    }

    return data.map((message) => ({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone ?? "",
      subject: message.subject,
      message: message.message,
      status: message.status,
      createdAt: message.created_at,
    }));
  } catch {
    return mockMessages;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasSupabasePublicEnv) {
    return mockDashboardStats;
  }

  try {
    const [bookings, classes, messages, posts] = await Promise.all([
      getBookings(),
      getClasses(),
      getContactMessages(),
      getBlogPosts({ includeDrafts: true }),
    ]);

    return {
      bookingCount: bookings.length,
      upcomingClassCount: classes.filter((item) => item.status === "scheduled").length,
      unreadMessageCount: messages.filter((item) => item.status === "unread").length,
      publishedPostCount: posts.filter((item) => item.status === "published").length,
    };
  } catch {
    return mockDashboardStats;
  }
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  if (!hasSupabasePublicEnv) {
    return mockMediaAssets;
  }

  try {
    const adminSupabase = createAdminSupabaseClient();
    const { data } = await adminSupabase!.storage.from("media").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (!data) {
      return mockMediaAssets;
    }

    return data.map((asset) => ({
      name: asset.name,
      url: adminSupabase!.storage.from("media").getPublicUrl(asset.name).data.publicUrl,
      bucket: "media",
      createdAt: asset.created_at ?? new Date().toISOString(),
    }));
  } catch {
    return mockMediaAssets;
  }
}

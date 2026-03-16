const fallbackSiteUrl = "https://ohm-joga.hu";

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey:
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  bookingFromEmail: process.env.BOOKING_FROM_EMAIL ?? "",
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL ?? "",
  previewAdminEmail:
    process.env.ADMIN_PREVIEW_EMAIL ?? "admin@ohm-joga.hu",
  previewAdminPassword:
    process.env.ADMIN_PREVIEW_PASSWORD ?? "preview123",
  mediaBucket: process.env.SUPABASE_MEDIA_BUCKET ?? "media",
  studioTimezone: process.env.NEXT_PUBLIC_STUDIO_TIMEZONE ?? "Europe/Budapest",
};

export const hasSupabasePublicEnv =
  Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey);

export const hasSupabaseServiceEnv =
  hasSupabasePublicEnv && Boolean(env.supabaseServiceRoleKey);

export const hasEmailEnv =
  Boolean(env.resendApiKey) &&
  Boolean(env.bookingFromEmail) &&
  Boolean(env.adminNotificationEmail);

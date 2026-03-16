import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Adj meg érvényes email címet."),
  password: z.string().min(6, "A jelszó túl rövid."),
});

export const blogFormSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(30),
  coverImageUrl: z.string().url(),
  categoryId: z.string().min(1),
  featured: z.boolean().optional(),
  publishedAt: z.string().min(1),
  readTime: z.string().min(2),
  status: z.enum(["draft", "published"]),
  metaTitle: z.string().min(5),
  metaDescription: z.string().min(10),
});

export const classFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string().min(3),
  startsAtLocal: z.string().min(1),
  endsAtLocal: z.string().min(1),
  locationName: z.string().min(2),
  locationAddress: z.string().min(2),
  capacity: z.coerce.number().int().min(1).max(99),
  status: z.enum(["scheduled", "cancelled", "completed"]),
  isRecurring: z.boolean().optional(),
  repeatMode: z.enum(["none", "weekly"]).default("none"),
  repeatCount: z.coerce.number().int().min(1).max(24).default(1),
});

export const calendarDayFormSchema = z.object({
  id: z.string().optional(),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["class-day", "free-day", "unavailable"]),
  label: z.string().max(80).optional(),
  note: z.string().max(300).optional(),
});

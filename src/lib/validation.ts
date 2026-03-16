import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Válassz szolgáltatást."),
  classId: z.string().optional(),
  requestType: z.enum(["scheduled", "custom"]),
  preferredDate: z.string().optional(),
  name: z.string().min(2, "Add meg a neved."),
  email: z.string().email("Adj meg érvényes email címet."),
  phone: z.string().min(7, "Adj meg telefonszámot."),
  note: z.string().optional(),
  privacyAccepted: z.boolean().refine((value) => value, {
    message: "Az adatkezelést el kell fogadnod.",
  }),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Add meg a neved."),
  email: z.string().email("Adj meg érvényes email címet."),
  phone: z.string().optional(),
  subject: z.string().min(3, "Adj meg tárgyat."),
  message: z.string().min(10, "Írj legalább néhány mondatot."),
});

export const loginSchema = z.object({
  email: z.string().email("Adj meg érvényes email címet."),
  password: z.string().min(6, "A jelszó túl rövid."),
});

export const serviceFormSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3),
  title: z.string().min(3),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  audience: z.string().min(10),
  durationMinutes: z.coerce.number().min(15),
  priceLabel: z.string().min(2),
  deliveryMode: z.string().min(2),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().min(1),
});

export const classFormSchema = z.object({
  id: z.string().optional(),
  serviceId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  locationName: z.string().min(2),
  locationAddress: z.string().min(2),
  capacity: z.coerce.number().min(1),
  status: z.enum(["scheduled", "cancelled", "completed"]),
  isRecurring: z.boolean().optional(),
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

export const bookingStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "confirmed", "cancelled", "archived"]),
});

export const messageStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["unread", "read", "archived"]),
});

export const testimonialFormSchema = z.object({
  id: z.string().optional(),
  authorName: z.string().min(2),
  authorRole: z.string().min(2),
  quote: z.string().min(10),
  isVisible: z.boolean().optional(),
  sortOrder: z.coerce.number().min(1),
});

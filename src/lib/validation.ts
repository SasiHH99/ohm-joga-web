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

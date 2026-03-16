import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Adj meg érvényes email címet."),
  password: z.string().min(6, "A jelszó túl rövid."),
});

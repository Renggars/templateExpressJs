import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8)
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character");

export const objectId = z.string().uuid({
  message: "Invalid UUID format",
});

import { z } from "zod";
import { isReservedSlug } from "../utils/shortCode";

export const createLinkSchema = z.object({
  body: z.object({
    destinationUrl: z.string().url("Must be a valid URL"),
    customSlug: z.string()
      .min(3, "Custom slug must be at least 3 characters")
      .max(50, "Custom slug cannot exceed 50 characters")
      .regex(/^[a-zA-Z0-9-_]+$/, "Custom slug can only contain letters, numbers, hyphens, and underscores")
      .optional()
      .refine(val => !val || !isReservedSlug(val), {
        message: "This custom slug is reserved and cannot be used",
      }),
  }),
});

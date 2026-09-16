import { z } from "zod";

export const updateBioProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
    bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
    avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    theme: z.enum(["minimal-light", "dark-slate", "gradient"]).optional(),
  }),
});

export const addSocialLinkSchema = z.object({
  body: z.object({
    platform: z.string().min(1, "Platform is required"),
    label: z.string().min(1, "Label is required"),
    url: z.string().url("Must be a valid URL"),
    icon: z.string().optional(),
    enabled: z.boolean().optional(),
  }),
});

export const reorderSocialLinksSchema = z.object({
  body: z.object({
    orderedIds: z.array(z.string()).min(2, "Provide at least two IDs to reorder"),
  }),
});

import { z } from "zod";

export const IssueScheama = z.object({
  title: z.string().min(1, "Title is Required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  comment: z.string().max(255).optional().nullable(),
  status: z.string().optional(),
});

export const patchIssueScheama = z.object({
  title: z.string().min(1, "Title is Required").max(255).optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(65535)
    .optional(),
  comment: z.string().max(255).optional().nullable(),
  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserIs is required and shouldn't be empty")
    .max(255)
    .optional()
    .nullable(),
  status: z.string().optional(),
});

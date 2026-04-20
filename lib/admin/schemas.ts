import { z } from "zod";

export const adminStatusSchema = z.enum(["ACTIVE", "DEACTIVATED"]);

export type AdminUserStatus = z.infer<typeof adminStatusSchema>;
export type AdminOrganizationStatus = z.infer<typeof adminStatusSchema>;
export type AdminCourseStatus = z.infer<typeof adminStatusSchema>;

export const adminTableSearchSchema = z.object({
  search: z.string().optional().nullable(),
});

export const adminLogLimitSchema = z.object({
  limit: z.number().int().min(0).max(500).default(500),
});

export const updateAdminUserStatusSchema = z.object({
  userId: z.number().int().positive(),
  status: adminStatusSchema,
});

export const updateAdminOrganizationStatusSchema = z.object({
  organizationId: z.number().int().positive(),
  status: adminStatusSchema,
});

export const updateAdminCourseStatusSchema = z.object({
  courseId: z.number().int().positive(),
  status: adminStatusSchema,
});

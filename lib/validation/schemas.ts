import { z } from "zod";

export const userTypeSchema = z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]);

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Enter a name."),
  displayName: z.string().trim().min(2, "Enter a display name."),
  email: z.email("Enter a valid email address.").transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .regex(/^[0-9+\-()\s]+$/, "Use only numbers and phone symbols."),
  userType: userTypeSchema,
  organizationId: z.number().int().positive().optional(),
});

export const createCourseSchema = z.object({
  name: z.string().trim().min(2, "Enter a course name."),
  summary: z.string().trim().min(10, "Enter a course summary."),
  content: z.array(z.string().trim().min(1, "Course content cannot be empty.")).min(1, "Add at least one content item."),
  organizationIds: z.array(z.number().int().positive()).optional(),
});

export const createBookmarkSchema = z.object({
  userId: z.number().int().positive(),
  courseId: z.number().int().positive(),
});

export const createCompletedCourseSchema = z.object({
  userId: z.number().int().positive(),
  courseId: z.number().int().positive(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type CreateCompletedCourseInput = z.infer<typeof createCompletedCourseSchema>;

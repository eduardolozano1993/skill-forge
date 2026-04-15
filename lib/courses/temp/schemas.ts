import z from "zod";

export const updateCourseContentSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  content: z.string().trim().min(1, "Course content is required."),
});

export const toggleCourseSelectionSchema = z.object({
  courseId: z.number().int().positive(),
});

import { z } from "zod";

export const managerCourseSelectionSchema = z.object({
  courseId: z.number().int().positive(),
});

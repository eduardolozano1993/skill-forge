import { describe, expect, it } from "vitest";

import {
  toggleCourseSelectionSchema,
  updateCourseContentSchema,
} from "./schemas";

describe("updateCourseContentSchema", () => {
  it("coerces a string courseId and trims content", () => {
    expect(
      updateCourseContentSchema.parse({
        courseId: "12",
        contentVersion: "3",
        content: "  Updated course content.  ",
      }),
    ).toEqual({
      courseId: 12,
      contentVersion: 3,
      content: "Updated course content.",
    });
  });

  it("rejects content that is empty after trimming", () => {
    const result = updateCourseContentSchema.safeParse({
      courseId: 12,
      contentVersion: 3,
      content: "   ",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Course content is required.");
    }
  });

  it("rejects non-positive or non-integer course ids", () => {
    expect(
      updateCourseContentSchema.safeParse({
        courseId: 0,
        contentVersion: 1,
        content: "Valid content",
      }).success,
    ).toBe(false);

    expect(
      updateCourseContentSchema.safeParse({
        courseId: 1.5,
        contentVersion: 1,
        content: "Valid content",
      }).success,
    ).toBe(false);
  });

  it("rejects non-positive content versions", () => {
    expect(
      updateCourseContentSchema.safeParse({
        courseId: 12,
        contentVersion: 0,
        content: "Valid content",
      }).success,
    ).toBe(false);
  });
});

describe("toggleCourseSelectionSchema", () => {
  it("accepts a positive integer course id", () => {
    expect(toggleCourseSelectionSchema.parse({ courseId: 7 })).toEqual({
      courseId: 7,
    });
  });

  it("rejects string course ids because the schema does not coerce values", () => {
    expect(
      toggleCourseSelectionSchema.safeParse({ courseId: "7" }).success,
    ).toBe(false);
  });

  it("rejects non-positive or non-integer course ids", () => {
    expect(toggleCourseSelectionSchema.safeParse({ courseId: 0 }).success).toBe(
      false,
    );
    expect(
      toggleCourseSelectionSchema.safeParse({ courseId: -1 }).success,
    ).toBe(false);
    expect(
      toggleCourseSelectionSchema.safeParse({ courseId: 2.5 }).success,
    ).toBe(false);
  });
});

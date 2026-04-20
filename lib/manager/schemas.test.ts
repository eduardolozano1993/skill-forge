import { describe, expect, it } from "vitest";

import { managerCourseSelectionSchema } from "./schemas";

describe("managerCourseSelectionSchema", () => {
  it("accepts a positive integer course id", () => {
    expect(
      managerCourseSelectionSchema.safeParse({
        courseId: 7,
      }),
    ).toEqual({
      success: true,
      data: {
        courseId: 7,
      },
    });
  });

  it("rejects zero, negative, and non-integer course ids", () => {
    expect(
      managerCourseSelectionSchema.safeParse({
        courseId: 0,
      }).success,
    ).toBe(false);

    expect(
      managerCourseSelectionSchema.safeParse({
        courseId: -1,
      }).success,
    ).toBe(false);

    expect(
      managerCourseSelectionSchema.safeParse({
        courseId: 2.5,
      }).success,
    ).toBe(false);
  });
});

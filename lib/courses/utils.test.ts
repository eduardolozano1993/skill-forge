import { describe, expect, it } from "vitest";

import type { CourseDetail } from "@/lib/courses/types";

import { filterCoursesByQuery } from "./utils";

const courseFixtures: CourseDetail[] = [
  {
    id: 1,
    name: "React Fundamentals",
    summary: "Learn React basics.",
    content: "React course content",
    status: "ACTIVE",
    isAssigned: true,
    isBookmarked: false,
    isCompleted: false,
  },
  {
    id: 2,
    name: "Advanced TypeScript",
    summary: "Deep dive into TypeScript.",
    content: "TypeScript course content",
    status: "ACTIVE",
    isAssigned: false,
    isBookmarked: true,
    isCompleted: false,
  },
  {
    id: 3,
    name: "Node.js API Design",
    summary: "Build backend services.",
    content: "Node.js course content",
    status: "DEACTIVATED",
    isAssigned: false,
    isBookmarked: false,
    isCompleted: true,
  },
];

describe("filterCoursesByQuery", () => {
  it("returns the original array when the query is empty after trimming", () => {
    expect(filterCoursesByQuery(courseFixtures, "   ")).toBe(courseFixtures);
  });

  it("matches course names case-insensitively", () => {
    expect(filterCoursesByQuery(courseFixtures, "typescript")).toEqual([
      courseFixtures[1],
    ]);
  });

  it("trims surrounding whitespace before filtering", () => {
    expect(filterCoursesByQuery(courseFixtures, "  react  ")).toEqual([
      courseFixtures[0],
    ]);
  });

  it("returns an empty array when no course names match the query", () => {
    expect(filterCoursesByQuery(courseFixtures, "python")).toEqual([]);
  });
});

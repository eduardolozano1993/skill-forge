import { describe, expect, it } from "vitest";

import type { AppCourse } from "./temp/types";
import { filterCoursesByQuery } from "./utils";

const courses: AppCourse[] = [
  {
    id: 1,
    title: "GraphQL Fundamentals",
    summary: "Learn how APIs model relationships and schemas.",
    content: "GraphQL course content",
    isAssigned: true,
  },
  {
    id: 2,
    title: "Reliable Queues",
    summary: "Covers retries, dead-letter queues, and idempotency patterns.",
    content: "Queue course content",
    isAssigned: true,
  },
];

describe("filterCoursesByQuery", () => {
  it("returns courses whose title matches the query", () => {
    const results = filterCoursesByQuery(courses, "graphql");

    expect(results).toEqual([courses[0]]);
  });

  it("returns courses whose summary matches the query", () => {
    const results = filterCoursesByQuery(courses, "idempotency");

    expect(results).toEqual([courses[1]]);
  });

  it("normalizes whitespace and casing for summary matches", () => {
    const results = filterCoursesByQuery(courses, "  DEAD-LETTER QUEUES ");

    expect(results).toEqual([courses[1]]);
  });
});

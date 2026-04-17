import { describe, expect, it } from "vitest";

import { sortByTextAndId } from "./text-sort";

describe("sortByTextAndId", () => {
  it("sorts by text before comparing ids", () => {
    const left = { id: 10 };
    const right = { id: 1 };

    expect(sortByTextAndId("Alice", "Bob", left, right)).toBeLessThan(0);
    expect(sortByTextAndId("Bob", "Alice", left, right)).toBeGreaterThan(0);
  });

  it("uses ids as a tiebreaker when labels match", () => {
    const left = { id: 2 };
    const right = { id: 7 };

    expect(sortByTextAndId("Same", "Same", left, right)).toBe(-5);
    expect(sortByTextAndId("Same", "Same", right, left)).toBe(5);
  });
});

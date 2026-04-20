import { describe, expect, it } from "vitest";

import { formatDate } from "./date-format";

describe("formatDate", () => {
  it("formats dates using the en-US medium date style", () => {
    expect(formatDate(new Date("2026-04-17T12:00:00.000Z"))).toBe(
      "Apr 17, 2026",
    );
  });
});

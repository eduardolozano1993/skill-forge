import { describe, expect, it } from "vitest";

import { cn } from "./tailwind";

describe("cn", () => {
  it("merges class values and filters falsy inputs", () => {
    expect(
      cn("px-2", undefined, null, false, "text-sm", {
        "font-bold": true,
        hidden: false,
      }),
    ).toBe("px-2 text-sm font-bold");
  });

  it("resolves conflicting Tailwind classes using tailwind-merge", () => {
    expect(cn("px-2", "px-4", "text-sm", "text-lg")).toBe("px-4 text-lg");
  });
});

import { describe, expect, it } from "vitest";

import { formatSignInLockoutLogEntry } from "./sign-in-log";

describe("sign-in lockout logging", () => {
  it("sanitizes attacker-controlled values before formatting the log entry", () => {
    const entry = formatSignInLockoutLogEntry({
      email: "attacker@example.com\r\nforged=true",
      ip: "203.0.113.7\nspoofed",
      retryAfterSeconds: 300,
    });

    expect(entry).toContain('"event":"rate_limit_reached"');
    expect(entry).toContain('"email":"attacker@example.com  forged=true"');
    expect(entry).toContain('"ip":"203.0.113.7 spoofed"');
    expect(entry).not.toContain("\r\nforged=true");
  });
});

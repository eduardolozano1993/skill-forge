import { beforeEach, describe, expect, it, vi } from "vitest";

const { compareMock, hashMock } = vi.hoisted(() => ({
  compareMock: vi.fn(),
  hashMock: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  compare: compareMock,
  hash: hashMock,
}));

import { comparePassword, hashPassword } from "./password";

describe("password helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hashes passwords with the configured bcrypt cost", async () => {
    hashMock.mockResolvedValue("hashed-password");

    await expect(hashPassword("plain-password")).resolves.toBe(
      "hashed-password",
    );
    expect(hashMock).toHaveBeenCalledWith("plain-password", 12);
  });

  it("compares the provided password against the stored hash", async () => {
    compareMock.mockResolvedValue(true);

    await expect(
      comparePassword({
        password: "plain-password",
        storedPassword: "stored-hash",
      }),
    ).resolves.toBe(true);

    expect(compareMock).toHaveBeenCalledWith(
      "plain-password",
      "stored-hash",
    );
  });
});

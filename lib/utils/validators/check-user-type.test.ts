import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAuthMock } = vi.hoisted(() => ({
  requireAuthMock: vi.fn(),
}));

vi.mock("../auth/auth", () => ({
  requireAuth: requireAuthMock,
}));

import { isAdmin } from "./check-user-type";

describe("isAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true when the authenticated user is an admin", async () => {
    requireAuthMock.mockResolvedValue({
      user: {
        userType: "ADMIN",
      },
    });

    await expect(isAdmin()).resolves.toBe(true);
    expect(requireAuthMock).toHaveBeenCalledTimes(1);
  });

  it("returns false when the authenticated user is not an admin", async () => {
    requireAuthMock.mockResolvedValue({
      user: {
        userType: "MANAGER",
      },
    });

    await expect(isAdmin()).resolves.toBe(false);
    expect(requireAuthMock).toHaveBeenCalledTimes(1);
  });
});

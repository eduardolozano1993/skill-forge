import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, redirectMock, findUniqueMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  redirectMock: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
  findUniqueMock: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: authMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/prisma/prisma", () => ({
  prisma: {
    user: {
      findUnique: findUniqueMock,
    },
  },
}));

import { requireAuth } from "./auth";

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users to the sign-in page", async () => {
    authMock.mockResolvedValue(null);

    await expect(requireAuth()).rejects.toThrow("redirect:/sign-in");
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("redirects users whose current database record is deactivated", async () => {
    authMock.mockResolvedValue({
      user: {
        id: "5",
      },
    });
    findUniqueMock.mockResolvedValue({
      id: 5,
      status: "DEACTIVATED",
    });

    await expect(requireAuth()).rejects.toThrow("redirect:/sign-in");
  });

  it("refreshes the session user from the current database record", async () => {
    const session = {
      user: {
        id: "5",
        email: "old@example.com",
        name: "Old Name",
        displayName: "Old",
        phone: "111",
        userType: "EMPLOYEE",
        organizationId: null,
      },
    };
    authMock.mockResolvedValue(session);
    findUniqueMock.mockResolvedValue({
      id: 5,
      email: "admin@example.com",
      name: "Admin User",
      displayName: "Admin",
      phone: "222",
      userType: "ADMIN",
      organizationId: 12,
      status: "ACTIVE",
    });

    await expect(requireAuth()).resolves.toEqual({
      user: {
        id: "5",
        email: "admin@example.com",
        name: "Admin User",
        displayName: "Admin",
        phone: "222",
        userType: "ADMIN",
        organizationId: 12,
      },
    });
    expect(session.user).toEqual({
      id: "5",
      email: "old@example.com",
      name: "Old Name",
      displayName: "Old",
      phone: "111",
      userType: "EMPLOYEE",
      organizationId: null,
    });
  });
});

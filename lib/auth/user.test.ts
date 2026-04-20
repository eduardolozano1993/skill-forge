import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUniqueMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
}));

vi.mock("@/lib/utils/prisma/prisma", () => ({
  prisma: {
    user: {
      findUnique: findUniqueMock,
    },
  },
}));

import {
  authUserSelect,
  clearAuthTokenUser,
  getAuthSessionUserFromToken,
  getAuthUserId,
  isAuthUserType,
  loadActiveAuthUserById,
  setSessionUser,
  setTokenUser,
  toAuthSessionUser,
} from "./user";

describe("auth user helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses valid auth user ids and rejects invalid ones", () => {
    expect(getAuthUserId("5")).toBe(5);
    expect(getAuthUserId(9)).toBe(9);
    expect(getAuthUserId("0")).toBeNull();
    expect(getAuthUserId("abc")).toBeNull();
  });

  it("recognizes the allowed auth user types", () => {
    expect(isAuthUserType("ADMIN")).toBe(true);
    expect(isAuthUserType("EMPLOYEE")).toBe(true);
    expect(isAuthUserType("OWNER")).toBe(false);
  });

  it("maps a database auth user record into the session shape", () => {
    expect(
      toAuthSessionUser({
        id: 7,
        email: "user@example.com",
        name: "User Example",
        displayName: "User",
        phone: "555",
        userType: "MANAGER",
        organizationId: 12,
        status: "ACTIVE",
      }),
    ).toEqual({
      id: "7",
      email: "user@example.com",
      name: "User Example",
      displayName: "User",
      phone: "555",
      userType: "MANAGER",
      organizationId: 12,
    });
  });

  it("returns a new session object with the authenticated user merged in", () => {
    const session = {
      expires: "2099-01-01T00:00:00.000Z",
      user: {
        email: "old@example.com",
      },
    };

    const updatedSession = setSessionUser(session, {
      id: "7",
      email: "user@example.com",
      name: "User Example",
      displayName: "User",
      phone: "555",
      userType: "MANAGER",
      organizationId: 12,
    });

    expect(updatedSession).toEqual({
      expires: "2099-01-01T00:00:00.000Z",
      user: {
        email: "user@example.com",
        id: "7",
        name: "User Example",
        displayName: "User",
        phone: "555",
        userType: "MANAGER",
        organizationId: 12,
      },
    });
    expect(updatedSession).not.toBe(session);
  });

  it("extracts a session user from a valid token and defaults optional values", () => {
    expect(
      getAuthSessionUserFromToken({
        sub: "7",
        email: "user@example.com",
        name: "User Example",
        displayName: "User",
        phone: "555",
        userType: "MANAGER",
        organizationId: 12,
      }),
    ).toEqual({
      id: "7",
      email: "user@example.com",
      name: "User Example",
      displayName: "User",
      phone: "555",
      userType: "MANAGER",
      organizationId: 12,
    });

    expect(
      getAuthSessionUserFromToken({
        sub: "7",
        userType: "EMPLOYEE",
      }),
    ).toEqual({
      id: "7",
      email: "",
      name: "",
      displayName: "",
      phone: "",
      userType: "EMPLOYEE",
      organizationId: null,
    });
  });

  it("returns null when the token cannot represent an authenticated user", () => {
    expect(getAuthSessionUserFromToken({ sub: "7", userType: "OWNER" })).toBeNull();
    expect(getAuthSessionUserFromToken({ userType: "ADMIN" })).toBeNull();
  });

  it("clears auth fields from the token object", () => {
    const token = {
      sub: "7",
      email: "user@example.com",
      name: "User Example",
      displayName: "User",
      phone: "555",
      userType: "MANAGER",
      organizationId: 12,
    };

    expect(clearAuthTokenUser(token)).toEqual({});
    expect(token).toEqual({});
  });

  it("writes the auth user fields into the token object", () => {
    const token = {};

    expect(
      setTokenUser(token, {
        id: "7",
        email: "user@example.com",
        name: "User Example",
        displayName: "User",
        phone: "555",
        userType: "MANAGER",
        organizationId: 12,
      }),
    ).toEqual({
      sub: "7",
      email: "user@example.com",
      name: "User Example",
      displayName: "User",
      phone: "555",
      userType: "MANAGER",
      organizationId: 12,
    });
  });

  it("loads only active auth users with the shared select shape", async () => {
    const user = {
      id: 7,
      email: "user@example.com",
      name: "User Example",
      displayName: "User",
      phone: "555",
      userType: "MANAGER",
      organizationId: 12,
      status: "ACTIVE",
    };
    findUniqueMock.mockResolvedValue(user);

    await expect(loadActiveAuthUserById(7)).resolves.toEqual(user);
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 7 },
      select: authUserSelect,
    });
  });

  it("returns null for missing or inactive auth users", async () => {
    findUniqueMock.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 7,
      email: "user@example.com",
      name: "User Example",
      displayName: "User",
      phone: "555",
      userType: "MANAGER",
      organizationId: 12,
      status: "DEACTIVATED",
    });

    await expect(loadActiveAuthUserById(7)).resolves.toBeNull();
    await expect(loadActiveAuthUserById(8)).resolves.toBeNull();
  });
});

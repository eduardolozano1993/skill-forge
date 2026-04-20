import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  comparePasswordMock,
  logSignInLockoutMock,
  getRemainingBlockSecondsMock,
  getSignInRateLimitKeyMock,
  registerFailedSignInAttemptMock,
  resetFailedSignInAttemptsMock,
  findUniqueMock,
} = vi.hoisted(() => ({
  comparePasswordMock: vi.fn(),
  logSignInLockoutMock: vi.fn(),
  getRemainingBlockSecondsMock: vi.fn(),
  getSignInRateLimitKeyMock: vi.fn(),
  registerFailedSignInAttemptMock: vi.fn(),
  resetFailedSignInAttemptsMock: vi.fn(),
  findUniqueMock: vi.fn(),
}));

vi.mock("@/lib/auth/password", () => ({
  comparePassword: comparePasswordMock,
}));

vi.mock("@/lib/auth/sign-in-log", () => ({
  logSignInLockout: logSignInLockoutMock,
}));

vi.mock("@/lib/auth/sign-in-rate-limit", () => ({
  getRemainingBlockSeconds: getRemainingBlockSecondsMock,
  getSignInRateLimitKey: getSignInRateLimitKeyMock,
  registerFailedSignInAttempt: registerFailedSignInAttemptMock,
  resetFailedSignInAttempts: resetFailedSignInAttemptsMock,
}));

vi.mock("@/lib/utils/prisma/prisma", () => ({
  prisma: {
    user: {
      findUnique: findUniqueMock,
    },
  },
}));

import { authenticateCredentials } from "./credentials";

describe("authenticateCredentials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSignInRateLimitKeyMock.mockReturnValue("rate-limit-key");
    getRemainingBlockSecondsMock.mockResolvedValue(0);
    resetFailedSignInAttemptsMock.mockResolvedValue(undefined);
    logSignInLockoutMock.mockResolvedValue(undefined);
  });

  it("returns blocked immediately when the rate limit is already active", async () => {
    getRemainingBlockSecondsMock.mockResolvedValue(120);

    await expect(
      authenticateCredentials({
        email: "user@example.com",
        password: "secret",
        ip: "127.0.0.1",
      }),
    ).resolves.toEqual({
      status: "blocked",
      retryAfterSeconds: 120,
    });

    expect(findUniqueMock).not.toHaveBeenCalled();
    expect(registerFailedSignInAttemptMock).not.toHaveBeenCalled();
  });

  it("records failed attempts for invalid credentials", async () => {
    findUniqueMock.mockResolvedValue({
      id: 7,
      email: "user@example.com",
      password: "stored-hash",
      status: "ACTIVE",
    });
    comparePasswordMock.mockResolvedValue(false);
    registerFailedSignInAttemptMock.mockResolvedValue({
      blocked: false,
      thresholdReached: false,
      retryAfterSeconds: 0,
    });

    await expect(
      authenticateCredentials({
        email: "user@example.com",
        password: "wrong",
        ip: "203.0.113.9",
      }),
    ).resolves.toEqual({
      status: "invalid",
    });

    expect(registerFailedSignInAttemptMock).toHaveBeenCalledWith(
      "rate-limit-key",
    );
    expect(resetFailedSignInAttemptsMock).not.toHaveBeenCalled();
  });

  it("logs the lockout when the failed-attempt threshold is reached", async () => {
    findUniqueMock.mockResolvedValue(null);
    registerFailedSignInAttemptMock.mockResolvedValue({
      blocked: true,
      thresholdReached: true,
      retryAfterSeconds: 300,
    });

    await expect(
      authenticateCredentials({
        email: "user@example.com",
        password: "wrong",
        ip: "203.0.113.9",
      }),
    ).resolves.toEqual({
      status: "blocked",
      retryAfterSeconds: 300,
    });

    expect(logSignInLockoutMock).toHaveBeenCalledWith({
      email: "user@example.com",
      ip: "203.0.113.9",
      retryAfterSeconds: 300,
    });
  });

  it("returns an authenticated user and clears failed attempts after a valid sign-in", async () => {
    const user = {
      id: 7,
      email: "user@example.com",
      password: "stored-hash",
      name: "User",
      displayName: "User",
      phone: "555",
      userType: "ADMIN",
      organizationId: null,
      status: "ACTIVE",
    };
    findUniqueMock.mockResolvedValue(user);
    comparePasswordMock.mockResolvedValue(true);

    await expect(
      authenticateCredentials({
        email: "user@example.com",
        password: "secret",
        ip: "203.0.113.9",
      }),
    ).resolves.toEqual({
      status: "authenticated",
      user,
    });

    expect(resetFailedSignInAttemptsMock).toHaveBeenCalledWith("rate-limit-key");
  });

  it("returns the deactivated result after valid credentials for a deactivated user", async () => {
    const user = {
      id: 9,
      email: "disabled@example.com",
      password: "stored-hash",
      name: "Disabled",
      displayName: "Disabled",
      phone: "555",
      userType: "EMPLOYEE",
      organizationId: 4,
      status: "DEACTIVATED",
    };
    findUniqueMock.mockResolvedValue(user);
    comparePasswordMock.mockResolvedValue(true);

    await expect(
      authenticateCredentials({
        email: "disabled@example.com",
        password: "secret",
        ip: "203.0.113.9",
      }),
    ).resolves.toEqual({
      status: "deactivated",
      user,
    });

    expect(resetFailedSignInAttemptsMock).toHaveBeenCalledWith("rate-limit-key");
  });
});

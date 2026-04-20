import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireAdminMock,
  readThroughJsonCacheMock,
  deleteCacheKeysMock,
  deleteCacheKeysByPatternMock,
  getManagerDashboardCacheKeyMock,
  fetchAdminPlatformSummaryMock,
  fetchAdminCoursesTableDataMock,
  fetchAdminSignInLogDataMock,
  findUserStatusRecordMock,
  updateUserStatusMock,
  findOrganizationStatusRecordMock,
  updateOrganizationStatusWithUsersMock,
  findCourseStatusRecordMock,
  updateCourseStatusMock,
} = vi.hoisted(() => ({
  requireAdminMock: vi.fn(),
  readThroughJsonCacheMock: vi.fn(),
  deleteCacheKeysMock: vi.fn(),
  deleteCacheKeysByPatternMock: vi.fn(),
  getManagerDashboardCacheKeyMock: vi.fn(),
  fetchAdminPlatformSummaryMock: vi.fn(),
  fetchAdminCoursesTableDataMock: vi.fn(),
  fetchAdminSignInLogDataMock: vi.fn(),
  findUserStatusRecordMock: vi.fn(),
  updateUserStatusMock: vi.fn(),
  findOrganizationStatusRecordMock: vi.fn(),
  updateOrganizationStatusWithUsersMock: vi.fn(),
  findCourseStatusRecordMock: vi.fn(),
  updateCourseStatusMock: vi.fn(),
}));

vi.mock("@/lib/auth/auth", () => ({
  requireAdmin: requireAdminMock,
}));

vi.mock("@/lib/utils/redis/cache", () => ({
  ADMIN_PLATFORM_SUMMARY_CACHE_KEY: "cache:admin:platform-summary",
  readThroughJsonCache: readThroughJsonCacheMock,
  deleteCacheKeys: deleteCacheKeysMock,
  deleteCacheKeysByPattern: deleteCacheKeysByPatternMock,
  getManagerDashboardCacheKey: getManagerDashboardCacheKeyMock,
}));

vi.mock("./queries", () => ({
  fetchAdminPlatformSummary: fetchAdminPlatformSummaryMock,
  fetchAdminCoursesTableData: fetchAdminCoursesTableDataMock,
  fetchAdminSignInLogData: fetchAdminSignInLogDataMock,
  findUserStatusRecord: findUserStatusRecordMock,
  updateUserStatus: updateUserStatusMock,
  findOrganizationStatusRecord: findOrganizationStatusRecordMock,
  updateOrganizationStatusWithUsers: updateOrganizationStatusWithUsersMock,
  findCourseStatusRecord: findCourseStatusRecordMock,
  updateCourseStatus: updateCourseStatusMock,
}));

import {
  getAdminCoursesTableData,
  getAdminPlatformSummary,
  getAdminSignInLogData,
  updateAdminCourseStatus,
  updateAdminOrganizationStatus,
  updateAdminUserStatus,
} from "./services";

describe("admin services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdminMock.mockResolvedValue(undefined);
    deleteCacheKeysMock.mockResolvedValue(undefined);
    deleteCacheKeysByPatternMock.mockResolvedValue(undefined);
    getManagerDashboardCacheKeyMock.mockImplementation(
      (organizationId: number) => `cache:manager:${organizationId}:dashboard`,
    );
    readThroughJsonCacheMock.mockImplementation(
      async (_key: string, fetcher: () => Promise<unknown>) => await fetcher(),
    );
  });

  it("requires admin access and caches the platform summary", async () => {
    const summary = {
      totalUsers: 20,
      totalCourses: 6,
      totalOrganizations: 4,
      totalCompletedCourses: 11,
    };
    fetchAdminPlatformSummaryMock.mockResolvedValue(summary);

    await expect(getAdminPlatformSummary()).resolves.toBe(summary);

    expect(requireAdminMock).toHaveBeenCalledTimes(1);
    expect(readThroughJsonCacheMock).toHaveBeenCalledWith(
      "cache:admin:platform-summary",
      fetchAdminPlatformSummaryMock,
    );
  });

  it("requires admin access before loading courses and sign-in logs", async () => {
    fetchAdminCoursesTableDataMock.mockResolvedValue({
      search: "react",
      rows: [],
    });
    fetchAdminSignInLogDataMock.mockResolvedValue({
      exists: true,
      lines: ["line"],
    });

    await expect(getAdminCoursesTableData("react")).resolves.toEqual({
      search: "react",
      rows: [],
    });
    await expect(getAdminSignInLogData(25)).resolves.toEqual({
      exists: true,
      lines: ["line"],
    });

    expect(requireAdminMock).toHaveBeenCalledTimes(2);
    expect(fetchAdminCoursesTableDataMock).toHaveBeenCalledWith("react");
    expect(fetchAdminSignInLogDataMock).toHaveBeenCalledWith(25);
  });

  it("returns an error when the user does not exist", async () => {
    findUserStatusRecordMock.mockResolvedValue(null);

    await expect(updateAdminUserStatus(7, "ACTIVE")).resolves.toEqual({
      success: false,
      error: "User not found.",
    });

    expect(updateUserStatusMock).not.toHaveBeenCalled();
  });

  it("returns an error when attempting to update an admin account", async () => {
    findUserStatusRecordMock.mockResolvedValue({
      id: 7,
      userType: "ADMIN",
      status: "ACTIVE",
      organizationId: null,
    });

    await expect(updateAdminUserStatus(7, "DEACTIVATED")).resolves.toEqual({
      success: false,
      error: "Admin accounts cannot be deactivated or activated from this table.",
    });

    expect(updateUserStatusMock).not.toHaveBeenCalled();
  });

  it("returns unchanged when the user already has the requested status", async () => {
    findUserStatusRecordMock.mockResolvedValue({
      id: 7,
      userType: "EMPLOYEE",
      status: "ACTIVE",
      organizationId: 2,
    });

    await expect(updateAdminUserStatus(7, "ACTIVE")).resolves.toEqual({
      success: true,
      status: "ACTIVE",
      changed: false,
    });

    expect(deleteCacheKeysMock).not.toHaveBeenCalled();
  });

  it("updates a user status and invalidates the platform and manager caches", async () => {
    findUserStatusRecordMock.mockResolvedValue({
      id: 7,
      userType: "EMPLOYEE",
      status: "ACTIVE",
      organizationId: 2,
    });
    updateUserStatusMock.mockResolvedValue({
      status: "DEACTIVATED",
    });

    await expect(updateAdminUserStatus(7, "DEACTIVATED")).resolves.toEqual({
      success: true,
      status: "DEACTIVATED",
      changed: true,
    });

    expect(updateUserStatusMock).toHaveBeenCalledWith(7, "DEACTIVATED");
    expect(deleteCacheKeysMock).toHaveBeenCalledWith([
      "cache:admin:platform-summary",
      "cache:manager:2:dashboard",
    ]);
  });

  it("returns an error when the organization does not exist", async () => {
    findOrganizationStatusRecordMock.mockResolvedValue(null);

    await expect(updateAdminOrganizationStatus(4, "ACTIVE")).resolves.toEqual({
      success: false,
      error: "Organization not found.",
    });
  });

  it("returns unchanged when the organization already has the requested status", async () => {
    findOrganizationStatusRecordMock.mockResolvedValue({
      id: 4,
      status: "ACTIVE",
    });

    await expect(updateAdminOrganizationStatus(4, "ACTIVE")).resolves.toEqual({
      success: true,
      status: "ACTIVE",
      changed: false,
      affectedUsers: 0,
    });

    expect(updateOrganizationStatusWithUsersMock).not.toHaveBeenCalled();
    expect(deleteCacheKeysMock).not.toHaveBeenCalled();
  });

  it("updates the organization and invalidates summary and manager caches", async () => {
    findOrganizationStatusRecordMock.mockResolvedValue({
      id: 4,
      status: "ACTIVE",
    });
    updateOrganizationStatusWithUsersMock.mockResolvedValue({
      status: "DEACTIVATED",
      affectedUsers: 9,
    });

    await expect(
      updateAdminOrganizationStatus(4, "DEACTIVATED"),
    ).resolves.toEqual({
      success: true,
      status: "DEACTIVATED",
      changed: true,
      affectedUsers: 9,
    });

    expect(updateOrganizationStatusWithUsersMock).toHaveBeenCalledWith(
      4,
      "DEACTIVATED",
    );
    expect(deleteCacheKeysMock).toHaveBeenCalledWith([
      "cache:admin:platform-summary",
      "cache:manager:4:dashboard",
    ]);
  });

  it("returns an error when the course does not exist", async () => {
    findCourseStatusRecordMock.mockResolvedValue(null);

    await expect(updateAdminCourseStatus(3, "ACTIVE")).resolves.toEqual({
      success: false,
      error: "Course not found.",
    });
  });

  it("returns unchanged when the course already has the requested status", async () => {
    findCourseStatusRecordMock.mockResolvedValue({
      id: 3,
      status: "ACTIVE",
    });

    await expect(updateAdminCourseStatus(3, "ACTIVE")).resolves.toEqual({
      success: true,
      status: "ACTIVE",
      changed: false,
    });

    expect(updateCourseStatusMock).not.toHaveBeenCalled();
    expect(deleteCacheKeysByPatternMock).not.toHaveBeenCalled();
  });

  it("updates the course and invalidates summary and course detail caches", async () => {
    findCourseStatusRecordMock.mockResolvedValue({
      id: 3,
      status: "ACTIVE",
    });
    updateCourseStatusMock.mockResolvedValue({
      status: "DEACTIVATED",
    });

    await expect(updateAdminCourseStatus(3, "DEACTIVATED")).resolves.toEqual({
      success: true,
      status: "DEACTIVATED",
      changed: true,
    });

    expect(updateCourseStatusMock).toHaveBeenCalledWith(3, "DEACTIVATED");
    expect(deleteCacheKeysMock).toHaveBeenCalledWith([
      "cache:admin:platform-summary",
    ]);
    expect(deleteCacheKeysByPatternMock).toHaveBeenCalledWith([
      "cache:course:3:detail:*",
    ]);
  });
});

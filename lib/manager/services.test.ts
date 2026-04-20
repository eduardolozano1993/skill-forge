import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireManagerMock,
  deleteCacheKeysMock,
  getManagerDashboardCacheKeyMock,
  getManagerDashboardDataMock,
  courseIsActiveMock,
  createOrganizationCourseAssignmentMock,
  assignBookmarkedCourseToOrganizationMock,
  deleteOrganizationCourseAssignmentMock,
} = vi.hoisted(() => ({
  requireManagerMock: vi.fn(),
  deleteCacheKeysMock: vi.fn(),
  getManagerDashboardCacheKeyMock: vi.fn(),
  getManagerDashboardDataMock: vi.fn(),
  courseIsActiveMock: vi.fn(),
  createOrganizationCourseAssignmentMock: vi.fn(),
  assignBookmarkedCourseToOrganizationMock: vi.fn(),
  deleteOrganizationCourseAssignmentMock: vi.fn(),
}));

vi.mock("@/lib/auth/auth", () => ({
  requireManager: requireManagerMock,
}));

vi.mock("@/lib/utils/redis/cache", () => ({
  deleteCacheKeys: deleteCacheKeysMock,
  getManagerDashboardCacheKey: getManagerDashboardCacheKeyMock,
}));

vi.mock("./queries", () => ({
  getManagerDashboardData: getManagerDashboardDataMock,
  courseIsActive: courseIsActiveMock,
  createOrganizationCourseAssignment: createOrganizationCourseAssignmentMock,
  assignBookmarkedCourseToOrganization: assignBookmarkedCourseToOrganizationMock,
  deleteOrganizationCourseAssignment: deleteOrganizationCourseAssignmentMock,
}));

import {
  assignBookmarkedCourse,
  assignCourseToOrganization,
  getManagerDashboardData,
  removeAssignedCourseFromOrganization,
} from "./services";

describe("manager services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteCacheKeysMock.mockResolvedValue(undefined);
    getManagerDashboardCacheKeyMock.mockImplementation(
      (organizationId: number) => `cache:manager:${organizationId}:dashboard`,
    );
  });

  it("re-exports getManagerDashboardData from the queries module", async () => {
    const dashboard = {
      organization: null,
      summary: {
        totalEmployees: 0,
        totalAssignedCourses: 0,
        totalCompletedCourses: 0,
      },
      assignedCourses: [],
      bookmarkedCourses: [],
    };
    getManagerDashboardDataMock.mockResolvedValue(dashboard);

    await expect(getManagerDashboardData()).resolves.toBe(dashboard);
    expect(getManagerDashboardDataMock).toHaveBeenCalledTimes(1);
  });

  it("returns an error when the manager is not linked to an organization", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: null,
      },
    });

    await expect(assignCourseToOrganization(4)).resolves.toEqual({
      success: false,
      error: "This manager account is not linked to an organization.",
    });

    expect(courseIsActiveMock).not.toHaveBeenCalled();
  });

  it("returns an error when assigning an inactive course", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: 9,
      },
    });
    courseIsActiveMock.mockResolvedValue(false);

    await expect(assignCourseToOrganization(4)).resolves.toEqual({
      success: false,
      error: "Course not found.",
    });

    expect(createOrganizationCourseAssignmentMock).not.toHaveBeenCalled();
    expect(deleteCacheKeysMock).not.toHaveBeenCalled();
  });

  it("assigns an active course and invalidates the manager dashboard cache", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: 9,
      },
    });
    courseIsActiveMock.mockResolvedValue(true);
    createOrganizationCourseAssignmentMock.mockResolvedValue({
      assigned: true,
    });

    await expect(assignCourseToOrganization(4)).resolves.toEqual({
      success: true,
      assigned: true,
      alreadyAssigned: false,
    });

    expect(createOrganizationCourseAssignmentMock).toHaveBeenCalledWith({
      organizationId: 9,
      courseId: 4,
    });
    expect(deleteCacheKeysMock).toHaveBeenCalledWith([
      "cache:manager:9:dashboard",
    ]);
  });

  it("returns alreadyAssigned without cache invalidation when the assignment already exists", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: 9,
      },
    });
    courseIsActiveMock.mockResolvedValue(true);
    createOrganizationCourseAssignmentMock.mockResolvedValue({
      assigned: false,
    });

    await expect(assignCourseToOrganization(4)).resolves.toEqual({
      success: true,
      assigned: false,
      alreadyAssigned: true,
    });

    expect(deleteCacheKeysMock).not.toHaveBeenCalled();
  });

  it("assigns a bookmarked course and always invalidates the cache after the mutation", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: 5,
      },
    });
    courseIsActiveMock.mockResolvedValue(true);
    assignBookmarkedCourseToOrganizationMock.mockResolvedValue({
      assigned: false,
    });

    await expect(assignBookmarkedCourse(3)).resolves.toEqual({
      success: true,
      assigned: false,
    });

    expect(assignBookmarkedCourseToOrganizationMock).toHaveBeenCalledWith({
      organizationId: 5,
      courseId: 3,
    });
    expect(deleteCacheKeysMock).toHaveBeenCalledWith([
      "cache:manager:5:dashboard",
    ]);
  });

  it("returns an error when removing a course that is not assigned", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: 7,
      },
    });
    deleteOrganizationCourseAssignmentMock.mockResolvedValue({
      removed: false,
    });

    await expect(removeAssignedCourseFromOrganization(2)).resolves.toEqual({
      success: false,
      error: "Course is not currently assigned to this organization.",
    });

    expect(deleteCacheKeysMock).not.toHaveBeenCalled();
  });

  it("removes an assigned course and invalidates the manager dashboard cache", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: 7,
      },
    });
    deleteOrganizationCourseAssignmentMock.mockResolvedValue({
      removed: true,
    });

    await expect(removeAssignedCourseFromOrganization(2)).resolves.toEqual({
      success: true,
    });

    expect(deleteOrganizationCourseAssignmentMock).toHaveBeenCalledWith({
      organizationId: 7,
      courseId: 2,
    });
    expect(deleteCacheKeysMock).toHaveBeenCalledWith([
      "cache:manager:7:dashboard",
    ]);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  revalidatePathMock,
  adminTableSearchSafeParseMock,
  adminLogLimitSafeParseMock,
  updateAdminUserStatusSafeParseMock,
  updateAdminOrganizationStatusSafeParseMock,
  updateAdminCourseStatusSafeParseMock,
  getAdminPlatformSummaryMock,
  getAdminCoursesTableDataMock,
  getAdminSignInLogDataMock,
  updateAdminUserStatusMock,
  updateAdminOrganizationStatusMock,
  updateAdminCourseStatusMock,
} = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  adminTableSearchSafeParseMock: vi.fn(),
  adminLogLimitSafeParseMock: vi.fn(),
  updateAdminUserStatusSafeParseMock: vi.fn(),
  updateAdminOrganizationStatusSafeParseMock: vi.fn(),
  updateAdminCourseStatusSafeParseMock: vi.fn(),
  getAdminPlatformSummaryMock: vi.fn(),
  getAdminCoursesTableDataMock: vi.fn(),
  getAdminSignInLogDataMock: vi.fn(),
  updateAdminUserStatusMock: vi.fn(),
  updateAdminOrganizationStatusMock: vi.fn(),
  updateAdminCourseStatusMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("./schemas", () => ({
  adminTableSearchSchema: {
    safeParse: adminTableSearchSafeParseMock,
  },
  adminLogLimitSchema: {
    safeParse: adminLogLimitSafeParseMock,
  },
  updateAdminUserStatusSchema: {
    safeParse: updateAdminUserStatusSafeParseMock,
  },
  updateAdminOrganizationStatusSchema: {
    safeParse: updateAdminOrganizationStatusSafeParseMock,
  },
  updateAdminCourseStatusSchema: {
    safeParse: updateAdminCourseStatusSafeParseMock,
  },
}));

vi.mock("./services", () => ({
  getAdminPlatformSummary: getAdminPlatformSummaryMock,
  getAdminCoursesTableData: getAdminCoursesTableDataMock,
  getAdminSignInLogData: getAdminSignInLogDataMock,
  updateAdminUserStatus: updateAdminUserStatusMock,
  updateAdminOrganizationStatus: updateAdminOrganizationStatusMock,
  updateAdminCourseStatus: updateAdminCourseStatusMock,
}));

import {
  getAdminCoursesTableDataAction,
  getAdminPlatformSummaryAction,
  getAdminSignInLogDataAction,
  updateAdminCourseStatusAction,
  updateAdminOrganizationStatusAction,
  updateAdminUserStatusAction,
} from "./actions";

describe("admin actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates the platform summary action to services", async () => {
    const summary = {
      totalUsers: 10,
      totalCourses: 5,
      totalOrganizations: 3,
      totalCompletedCourses: 12,
    };
    getAdminPlatformSummaryMock.mockResolvedValue(summary);

    await expect(getAdminPlatformSummaryAction()).resolves.toBe(summary);
    expect(getAdminPlatformSummaryMock).toHaveBeenCalledTimes(1);
  });

  it("normalizes a valid course table search before delegating", async () => {
    adminTableSearchSafeParseMock.mockReturnValue({
      success: true,
      data: {
        search: "react",
      },
    });
    getAdminCoursesTableDataMock.mockResolvedValue({
      search: "react",
      rows: [],
    });

    await expect(getAdminCoursesTableDataAction(" React ")).resolves.toEqual({
      search: "react",
      rows: [],
    });

    expect(getAdminCoursesTableDataMock).toHaveBeenCalledWith("react");
  });

  it("falls back to an empty search when parsing the course table search fails", async () => {
    adminTableSearchSafeParseMock.mockReturnValue({
      success: false,
    });
    getAdminCoursesTableDataMock.mockResolvedValue({
      search: "",
      rows: [],
    });

    await getAdminCoursesTableDataAction("ignored");

    expect(getAdminCoursesTableDataMock).toHaveBeenCalledWith("");
  });

  it("uses the parsed log limit and falls back to 500 when parsing fails", async () => {
    adminLogLimitSafeParseMock
      .mockReturnValueOnce({
        success: true,
        data: {
          limit: 20,
        },
      })
      .mockReturnValueOnce({
        success: false,
      });
    getAdminSignInLogDataMock
      .mockResolvedValueOnce({
        exists: true,
        lines: [],
      })
      .mockResolvedValueOnce({
        exists: false,
        lines: [],
      });

    await getAdminSignInLogDataAction(20);
    await getAdminSignInLogDataAction(-1);

    expect(getAdminSignInLogDataMock).toHaveBeenNthCalledWith(1, 20);
    expect(getAdminSignInLogDataMock).toHaveBeenNthCalledWith(2, 500);
  });

  it("returns a validation error for invalid user status updates", async () => {
    updateAdminUserStatusSafeParseMock.mockReturnValue({
      success: false,
    });

    await expect(
      updateAdminUserStatusAction(0, "ACTIVE"),
    ).resolves.toEqual({
      success: false,
      error: "Invalid user status update.",
    });

    expect(updateAdminUserStatusMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("revalidates admin pages after a successful user status update", async () => {
    updateAdminUserStatusSafeParseMock.mockReturnValue({
      success: true,
      data: {
        userId: 7,
        status: "DEACTIVATED",
      },
    });
    updateAdminUserStatusMock.mockResolvedValue({
      success: true,
      status: "DEACTIVATED",
      changed: true,
    });

    await expect(
      updateAdminUserStatusAction(7, "DEACTIVATED"),
    ).resolves.toEqual({
      success: true,
      status: "DEACTIVATED",
      changed: true,
    });

    expect(updateAdminUserStatusMock).toHaveBeenCalledWith(7, "DEACTIVATED");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(1, "/admin");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(2, "/admin/users");
  });

  it("does not revalidate when an organization update fails in services", async () => {
    updateAdminOrganizationStatusSafeParseMock.mockReturnValue({
      success: true,
      data: {
        organizationId: 9,
        status: "ACTIVE",
      },
    });
    updateAdminOrganizationStatusMock.mockResolvedValue({
      success: false,
      error: "Organization not found.",
    });

    await expect(
      updateAdminOrganizationStatusAction(9, "ACTIVE"),
    ).resolves.toEqual({
      success: false,
      error: "Organization not found.",
    });

    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("revalidates all relevant pages after a successful course status update", async () => {
    updateAdminCourseStatusSafeParseMock.mockReturnValue({
      success: true,
      data: {
        courseId: 11,
        status: "DEACTIVATED",
      },
    });
    updateAdminCourseStatusMock.mockResolvedValue({
      success: true,
      status: "DEACTIVATED",
      changed: true,
    });

    await expect(
      updateAdminCourseStatusAction(11, "DEACTIVATED"),
    ).resolves.toEqual({
      success: true,
      status: "DEACTIVATED",
      changed: true,
    });

    expect(updateAdminCourseStatusMock).toHaveBeenCalledWith(
      11,
      "DEACTIVATED",
    );
    expect(revalidatePathMock).toHaveBeenNthCalledWith(1, "/admin");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(2, "/admin/courses");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(3, "/courses");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(4, "/courses/11");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(
      5,
      "/admin/courses/11/edit",
    );
  });
});

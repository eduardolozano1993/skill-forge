import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  readFileMock,
  prismaMock,
  normalizeTableSearchMock,
  matchesSearchMock,
  sortByTextAndIdMock,
} = vi.hoisted(() => ({
  readFileMock: vi.fn(),
  prismaMock: {
    user: {
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    course: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    organization: {
      count: vi.fn(),
      findUnique: vi.fn(),
    },
    completedCourse: {
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
  normalizeTableSearchMock: vi.fn(),
  matchesSearchMock: vi.fn(),
  sortByTextAndIdMock: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  readFile: readFileMock,
}));

vi.mock("@/lib/utils/prisma/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/utils/table/table", () => ({
  normalizeTableSearch: normalizeTableSearchMock,
  matchesSearch: matchesSearchMock,
}));

vi.mock("../utils/helpers/text-sort", () => ({
  sortByTextAndId: sortByTextAndIdMock,
}));

import {
  fetchAdminCoursesTableData,
  fetchAdminPlatformSummary,
  fetchAdminSignInLogData,
  findCourseStatusRecord,
  findOrganizationStatusRecord,
  findUserStatusRecord,
  updateCourseStatus,
  updateOrganizationStatusWithUsers,
  updateUserStatus,
} from "./queries";

describe("admin queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    normalizeTableSearchMock.mockImplementation((value: string | null | undefined) =>
      typeof value === "string" ? value.trim().toLowerCase() : "",
    );
    matchesSearchMock.mockReturnValue(true);
    sortByTextAndIdMock.mockImplementation((leftName: string, rightName: string) =>
      leftName.localeCompare(rightName),
    );
  });

  it("loads the admin platform summary counts", async () => {
    prismaMock.user.count.mockResolvedValue(25);
    prismaMock.course.count.mockResolvedValue(8);
    prismaMock.organization.count.mockResolvedValue(4);
    prismaMock.completedCourse.count.mockResolvedValue(30);

    await expect(fetchAdminPlatformSummary()).resolves.toEqual({
      totalUsers: 25,
      totalCourses: 8,
      totalOrganizations: 4,
      totalCompletedCourses: 30,
    });

    expect(prismaMock.course.count).toHaveBeenCalledWith({
      where: {
        status: "ACTIVE",
      },
    });
  });

  it("maps, filters, and sorts the admin courses table data", async () => {
    const createdAt = new Date("2026-04-20T00:00:00.000Z");
    normalizeTableSearchMock.mockReturnValue("react");
    prismaMock.course.findMany.mockResolvedValue([
      {
        id: 2,
        name: "TypeScript",
        summary: "Static typing",
        status: "ACTIVE",
        createdAt,
        _count: {
          organizations: 1,
          completedByUsers: 2,
          bookmarks: 3,
        },
      },
      {
        id: 1,
        name: "React Fundamentals",
        summary: "UI basics",
        status: "DEACTIVATED",
        createdAt,
        _count: {
          organizations: 4,
          completedByUsers: 8,
          bookmarks: 9,
        },
      },
    ]);
    matchesSearchMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    await expect(fetchAdminCoursesTableData("  React  ")).resolves.toEqual({
      search: "react",
      rows: [
        {
          id: 1,
          name: "React Fundamentals",
          summary: "UI basics",
          status: "DEACTIVATED",
          assignedOrganizationCount: 4,
          completedUserCount: 8,
          bookmarkCount: 9,
          createdAt,
        },
      ],
    });

    expect(normalizeTableSearchMock).toHaveBeenCalledWith("  React  ");
    expect(prismaMock.course.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        summary: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            organizations: true,
            completedByUsers: true,
            bookmarks: true,
          },
        },
      },
    });
    expect(matchesSearchMock).toHaveBeenNthCalledWith(1, "react", [
      2,
      "TypeScript",
      "Static typing",
      "ACTIVE",
    ]);
    expect(matchesSearchMock).toHaveBeenNthCalledWith(2, "react", [
      1,
      "React Fundamentals",
      "UI basics",
      "DEACTIVATED",
    ]);
  });

  it("reads and trims sign-in log lines up to the requested limit", async () => {
    readFileMock.mockResolvedValue(" first \n\nsecond\r\n third ");

    await expect(fetchAdminSignInLogData(2)).resolves.toEqual({
      exists: true,
      lines: ["first", "second"],
    });

    expect(readFileMock).toHaveBeenCalledTimes(1);
  });

  it("returns an empty sign-in log payload when the file is missing", async () => {
    const error = Object.assign(new Error("missing"), { code: "ENOENT" });
    readFileMock.mockRejectedValue(error);

    await expect(fetchAdminSignInLogData(10)).resolves.toEqual({
      exists: false,
      lines: [],
    });
  });

  it("rethrows unexpected sign-in log read errors", async () => {
    const error = new Error("permission denied");
    readFileMock.mockRejectedValue(error);

    await expect(fetchAdminSignInLogData(10)).rejects.toThrow(
      "permission denied",
    );
  });

  it("loads the user status record by id", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 7,
      userType: "EMPLOYEE",
      status: "ACTIVE",
      organizationId: 3,
    });

    await expect(findUserStatusRecord(7)).resolves.toEqual({
      id: 7,
      userType: "EMPLOYEE",
      status: "ACTIVE",
      organizationId: 3,
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: 7,
      },
      select: {
        id: true,
        userType: true,
        status: true,
        organizationId: true,
      },
    });
  });

  it("updates the selected user status", async () => {
    prismaMock.user.update.mockResolvedValue({
      status: "DEACTIVATED",
    });

    await expect(updateUserStatus(7, "DEACTIVATED")).resolves.toEqual({
      status: "DEACTIVATED",
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: {
        id: 7,
      },
      data: {
        status: "DEACTIVATED",
      },
      select: {
        status: true,
      },
    });
  });

  it("loads organization and course status records", async () => {
    prismaMock.organization.findUnique.mockResolvedValue({
      id: 4,
      status: "ACTIVE",
    });
    prismaMock.course.findUnique.mockResolvedValue({
      id: 9,
      status: "DEACTIVATED",
    });

    await expect(findOrganizationStatusRecord(4)).resolves.toEqual({
      id: 4,
      status: "ACTIVE",
    });
    await expect(findCourseStatusRecord(9)).resolves.toEqual({
      id: 9,
      status: "DEACTIVATED",
    });

    expect(prismaMock.organization.findUnique).toHaveBeenCalledWith({
      where: {
        id: 4,
      },
      select: {
        id: true,
        status: true,
      },
    });
    expect(prismaMock.course.findUnique).toHaveBeenCalledWith({
      where: {
        id: 9,
      },
      select: {
        id: true,
        status: true,
      },
    });
  });

  it("updates an organization and its non-admin users in one transaction", async () => {
    const tx = {
      organization: {
        update: vi.fn(),
      },
      user: {
        updateMany: vi.fn(),
      },
    };

    prismaMock.$transaction.mockImplementation(
      async (callback: (client: typeof tx) => Promise<unknown>) =>
        await callback(tx),
    );
    tx.organization.update.mockResolvedValue({
      status: "DEACTIVATED",
    });
    tx.user.updateMany.mockResolvedValue({
      count: 6,
    });

    await expect(
      updateOrganizationStatusWithUsers(5, "DEACTIVATED"),
    ).resolves.toEqual({
      status: "DEACTIVATED",
      affectedUsers: 6,
    });

    expect(tx.organization.update).toHaveBeenCalledWith({
      where: {
        id: 5,
      },
      data: {
        status: "DEACTIVATED",
      },
      select: {
        status: true,
      },
    });
    expect(tx.user.updateMany).toHaveBeenCalledWith({
      where: {
        organizationId: 5,
        userType: {
          not: "ADMIN",
        },
      },
      data: {
        status: "DEACTIVATED",
      },
    });
  });

  it("updates the selected course status", async () => {
    prismaMock.course.update.mockResolvedValue({
      status: "ACTIVE",
    });

    await expect(updateCourseStatus(3, "ACTIVE")).resolves.toEqual({
      status: "ACTIVE",
    });

    expect(prismaMock.course.update).toHaveBeenCalledWith({
      where: {
        id: 3,
      },
      data: {
        status: "ACTIVE",
      },
      select: {
        status: true,
      },
    });
  });
});

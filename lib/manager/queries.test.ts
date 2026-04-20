import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  prismaMock,
  requireManagerMock,
  getManagerDashboardCacheKeyMock,
  readThroughJsonCacheMock,
} = vi.hoisted(() => ({
  prismaMock: {
    course: {
      findUnique: vi.fn(),
    },
    organizationCourse: {
      createMany: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    organization: {
      findUnique: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    bookmark: {
      findMany: vi.fn(),
    },
    completedCourse: {
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
  requireManagerMock: vi.fn(),
  getManagerDashboardCacheKeyMock: vi.fn(),
  readThroughJsonCacheMock: vi.fn(),
}));

vi.mock("@/lib/utils/prisma/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/auth/auth", () => ({
  requireManager: requireManagerMock,
}));

vi.mock("@/lib/utils/redis/cache", () => ({
  getManagerDashboardCacheKey: getManagerDashboardCacheKeyMock,
  readThroughJsonCache: readThroughJsonCacheMock,
}));

import {
  assignBookmarkedCourseToOrganization,
  courseIsActive,
  createOrganizationCourseAssignment,
  deleteOrganizationCourseAssignment,
  getManagerDashboardData,
} from "./queries";

describe("manager queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getManagerDashboardCacheKeyMock.mockImplementation(
      (organizationId: number) => `cache:manager:${organizationId}:dashboard`,
    );
    readThroughJsonCacheMock.mockImplementation(
      async (_key: string, fetcher: () => Promise<unknown>) => await fetcher(),
    );
  });

  it("reports whether a course is active", async () => {
    prismaMock.course.findUnique
      .mockResolvedValueOnce({ status: "ACTIVE" })
      .mockResolvedValueOnce({ status: "DEACTIVATED" })
      .mockResolvedValueOnce(null);

    await expect(courseIsActive(1)).resolves.toBe(true);
    await expect(courseIsActive(2)).resolves.toBe(false);
    await expect(courseIsActive(3)).resolves.toBe(false);

    expect(prismaMock.course.findUnique).toHaveBeenNthCalledWith(1, {
      where: {
        id: 1,
      },
      select: {
        status: true,
      },
    });
  });

  it("creates organization assignments with duplicate protection", async () => {
    prismaMock.organizationCourse.createMany.mockResolvedValue({
      count: 1,
    });

    await expect(
      createOrganizationCourseAssignment({
        organizationId: 7,
        courseId: 4,
      }),
    ).resolves.toEqual({
      assigned: true,
    });

    expect(prismaMock.organizationCourse.createMany).toHaveBeenCalledWith({
      data: [
        {
          organizationId: 7,
          courseId: 4,
        },
      ],
      skipDuplicates: true,
    });
  });

  it("removes bookmarked employee entries before assigning a bookmarked course", async () => {
    const tx = {
      user: {
        findMany: vi.fn(),
      },
      bookmark: {
        deleteMany: vi.fn(),
      },
      organizationCourse: {
        createMany: vi.fn(),
      },
    };

    prismaMock.$transaction.mockImplementation(
      async (callback: (client: typeof tx) => Promise<unknown>) =>
        await callback(tx),
    );
    tx.user.findMany.mockResolvedValue([{ id: 3 }, { id: 9 }]);
    tx.bookmark.deleteMany.mockResolvedValue({ count: 2 });
    tx.organizationCourse.createMany.mockResolvedValue({ count: 1 });

    await expect(
      assignBookmarkedCourseToOrganization({
        organizationId: 11,
        courseId: 5,
      }),
    ).resolves.toEqual({
      assigned: true,
    });

    expect(tx.user.findMany).toHaveBeenCalledWith({
      where: {
        organizationId: 11,
        userType: "EMPLOYEE",
      },
      select: {
        id: true,
      },
    });
    expect(tx.bookmark.deleteMany).toHaveBeenCalledWith({
      where: {
        courseId: 5,
        userId: {
          in: [3, 9],
        },
      },
    });
    expect(tx.organizationCourse.createMany).toHaveBeenCalledWith({
      data: [
        {
          organizationId: 11,
          courseId: 5,
        },
      ],
      skipDuplicates: true,
    });
  });

  it("skips bookmark deletion when the organization has no employees", async () => {
    const tx = {
      user: {
        findMany: vi.fn(),
      },
      bookmark: {
        deleteMany: vi.fn(),
      },
      organizationCourse: {
        createMany: vi.fn(),
      },
    };

    prismaMock.$transaction.mockImplementation(
      async (callback: (client: typeof tx) => Promise<unknown>) =>
        await callback(tx),
    );
    tx.user.findMany.mockResolvedValue([]);
    tx.organizationCourse.createMany.mockResolvedValue({ count: 0 });

    await expect(
      assignBookmarkedCourseToOrganization({
        organizationId: 11,
        courseId: 5,
      }),
    ).resolves.toEqual({
      assigned: false,
    });

    expect(tx.bookmark.deleteMany).not.toHaveBeenCalled();
  });

  it("removes organization assignments by organization and course", async () => {
    prismaMock.organizationCourse.deleteMany.mockResolvedValue({
      count: 1,
    });

    await expect(
      deleteOrganizationCourseAssignment({
        organizationId: 4,
        courseId: 6,
      }),
    ).resolves.toEqual({
      removed: true,
    });

    expect(prismaMock.organizationCourse.deleteMany).toHaveBeenCalledWith({
      where: {
        organizationId: 4,
        courseId: 6,
      },
    });
  });

  it("returns an empty dashboard when the manager has no organization", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: null,
      },
    });

    await expect(getManagerDashboardData()).resolves.toEqual({
      organization: null,
      summary: {
        totalEmployees: 0,
        totalAssignedCourses: 0,
        totalCompletedCourses: 0,
      },
      assignedCourses: [],
      bookmarkedCourses: [],
    });

    expect(readThroughJsonCacheMock).not.toHaveBeenCalled();
  });

  it("loads, shapes, and caches the manager dashboard for an organization", async () => {
    requireManagerMock.mockResolvedValue({
      user: {
        organizationId: 12,
      },
    });
    prismaMock.organization.findUnique.mockResolvedValue({
      id: 12,
      name: "Skill Forge",
      owner: {
        displayName: "Owner User",
        email: "owner@example.com",
      },
    });
    prismaMock.user.count.mockResolvedValue(4);
    prismaMock.organizationCourse.count.mockResolvedValue(2);
    prismaMock.completedCourse.count.mockResolvedValue(3);
    prismaMock.organizationCourse.findMany.mockResolvedValue([
      {
        course: {
          id: 1,
          name: "React Fundamentals",
          completedByUsers: [{ userId: 3 }, { userId: 3 }, { userId: 9 }],
        },
      },
      {
        course: {
          id: 2,
          name: "Advanced TypeScript",
          completedByUsers: [],
        },
      },
    ]);
    prismaMock.bookmark.findMany.mockResolvedValue([
      {
        user: {
          id: 10,
          displayName: "Alice",
          email: "alice@example.com",
        },
        course: {
          id: 3,
          name: "Node APIs",
        },
      },
      {
        user: {
          id: 11,
          displayName: "Bob",
          email: "bob@example.com",
        },
        course: {
          id: 3,
          name: "Node APIs",
        },
      },
      {
        user: {
          id: 12,
          displayName: "Carol",
          email: "carol@example.com",
        },
        course: {
          id: 1,
          name: "React Fundamentals",
        },
      },
    ]);

    await expect(getManagerDashboardData()).resolves.toEqual({
      organization: {
        id: 12,
        name: "Skill Forge",
        ownerName: "Owner User",
        ownerEmail: "owner@example.com",
      },
      summary: {
        totalEmployees: 4,
        totalAssignedCourses: 2,
        totalCompletedCourses: 3,
      },
      assignedCourses: [
        {
          courseId: 1,
          courseName: "React Fundamentals",
          completedEmployees: 2,
          totalEmployees: 4,
          completionRate: 0.5,
        },
        {
          courseId: 2,
          courseName: "Advanced TypeScript",
          completedEmployees: 0,
          totalEmployees: 4,
          completionRate: 0,
        },
      ],
      bookmarkedCourses: [
        {
          courseId: 3,
          courseName: "Node APIs",
          employeeCount: 2,
          isAssigned: false,
        },
        {
          courseId: 1,
          courseName: "React Fundamentals",
          employeeCount: 1,
          isAssigned: true,
        },
      ],
    });

    expect(getManagerDashboardCacheKeyMock).toHaveBeenCalledWith(12);
    expect(readThroughJsonCacheMock).toHaveBeenCalledTimes(1);
    expect(prismaMock.organization.findUnique).toHaveBeenCalledWith({
      where: {
        id: 12,
      },
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            displayName: true,
            email: true,
          },
        },
      },
    });
  });
});

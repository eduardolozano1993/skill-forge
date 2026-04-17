import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  prismaMock,
  requireAuthMock,
  requireEmployeeMock,
} = vi.hoisted(() => ({
  prismaMock: {
    course: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    organizationCourse: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    bookmark: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
    },
    completedCourse: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
  requireAuthMock: vi.fn(),
  requireEmployeeMock: vi.fn(),
}));

vi.mock("@/lib/prisma/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/auth/auth", () => ({
  requireAuth: requireAuthMock,
  requireEmployee: requireEmployeeMock,
}));

import {
  findActiveCoursesById,
  findCourseById,
  getVisibleCoursesForUser,
  queryAdminCourses,
  queryCourses,
  requireEmployeeCourseBookmarkSelection,
  requireEmployeeCourseSelection,
  toggleEmployeeCourseBookmark,
  toggleEmployeeCourseCompletion,
  updateCourse,
} from "./queries";

function createSession(
  overrides?: Partial<{
    id: string;
    organizationId: number | null;
    userType: string;
  }>,
) {
  return {
    user: {
      id: overrides?.id ?? "12",
      organizationId:
        overrides && "organizationId" in overrides
          ? overrides.organizationId
          : 7,
      userType: overrides?.userType ?? "EMPLOYEE",
    },
  } as never;
}

describe("course queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries admin courses with search, pagination, and count mappings", async () => {
    prismaMock.course.count.mockResolvedValue(21);
    prismaMock.course.findMany.mockResolvedValue([
      {
        id: 5,
        name: "React Fundamentals",
        summary: "Intro course",
        status: "ACTIVE",
        _count: {
          organizations: 3,
          completedByUsers: 8,
          bookmarks: 2,
        },
      },
    ]);

    await expect(queryAdminCourses("React", 2)).resolves.toEqual({
      search: "React",
      rows: [
        {
          id: 5,
          name: "React Fundamentals",
          summary: "Intro course",
          status: "ACTIVE",
          assignedOrganizationCount: 3,
          completedUserCount: 8,
          bookmarkCount: 2,
        },
      ],
      pagination: {
        page: 2,
        pageSize: 10,
        totalRows: 21,
        totalPages: 3,
        hasPreviousPage: true,
        hasNextPage: true,
      },
    });

    expect(prismaMock.course.count).toHaveBeenCalledWith({
      where: {
        name: {
          contains: "React",
          mode: "insensitive",
        },
      },
    });
    expect(prismaMock.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          name: {
            contains: "React",
            mode: "insensitive",
          },
        },
        skip: 10,
        take: 10,
      }),
    );
  });

  it("queries active courses and serializes assignment, bookmark, and completion flags", async () => {
    prismaMock.course.count.mockResolvedValue(2);
    prismaMock.course.findMany.mockResolvedValue([
      {
        id: 3,
        name: "Node.js API Design",
        summary: "Backend course",
        content: "Course content",
        status: "ACTIVE",
        organizations: [{ courseId: 3 }],
        bookmarks: [{ courseId: 3 }],
        completedByUsers: [],
      },
    ]);

    await expect(queryCourses(createSession(), "node", 1)).resolves.toEqual({
      search: "node",
      rows: [
        {
          id: 3,
          name: "Node.js API Design",
          summary: "Backend course",
          content: "Course content",
          status: "ACTIVE",
          isAssigned: true,
          isBookmarked: true,
          isCompleted: false,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 12,
        totalRows: 2,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    });

    expect(prismaMock.course.count).toHaveBeenCalledWith({
      where: {
        status: "ACTIVE",
        name: {
          contains: "node",
          mode: "insensitive",
        },
      },
    });
    expect(prismaMock.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: "ACTIVE",
          name: {
            contains: "node",
            mode: "insensitive",
          },
        },
        skip: 0,
        take: 12,
      }),
    );
  });

  it("finds a course by id and serializes the user-state flags", async () => {
    prismaMock.course.findUnique.mockResolvedValue({
      id: 9,
      name: "Advanced TypeScript",
      summary: "Deep dive",
      content: "Typed content",
      status: "DEACTIVATED",
      organizations: [],
      bookmarks: [{ courseId: 9 }],
      completedByUsers: [{ courseId: 9 }],
    });

    await expect(findCourseById(9, createSession())).resolves.toEqual({
      id: 9,
      name: "Advanced TypeScript",
      summary: "Deep dive",
      content: "Typed content",
      status: "DEACTIVATED",
      isAssigned: false,
      isBookmarked: true,
      isCompleted: true,
    });
  });

  it("returns null when the active course lookup finds no active course", async () => {
    prismaMock.course.findFirst.mockResolvedValue(null);

    await expect(findActiveCoursesById(8, createSession())).resolves.toBeNull();
  });

  it("updates a course with the provided partial payload", async () => {
    const updatedCourse = { id: 4, content: "Updated content" };
    prismaMock.course.update.mockResolvedValue(updatedCourse);

    await expect(updateCourse(4, { content: "Updated content" })).resolves.toBe(
      updatedCourse,
    );

    expect(prismaMock.course.update).toHaveBeenCalledWith({
      where: {
        id: 4,
      },
      data: {
        content: "Updated content",
      },
    });
  });

  it("combines visible course state for the authenticated user", async () => {
    requireAuthMock.mockResolvedValue(createSession());
    prismaMock.course.findMany.mockResolvedValue([
      {
        id: 1,
        name: "React Fundamentals",
        summary: "Intro",
        content: "Content",
        status: "ACTIVE",
      },
      {
        id: 2,
        name: "Advanced TypeScript",
        summary: "Types",
        content: "Content",
        status: "ACTIVE",
      },
    ]);
    prismaMock.organizationCourse.findMany.mockResolvedValue([{ courseId: 1 }]);
    prismaMock.bookmark.findMany.mockResolvedValue([{ courseId: 2 }]);
    prismaMock.completedCourse.findMany.mockResolvedValue([{ courseId: 1 }]);

    await expect(getVisibleCoursesForUser()).resolves.toEqual({
      courses: [
        {
          id: 1,
          name: "React Fundamentals",
          summary: "Intro",
          content: "Content",
          status: "ACTIVE",
          isAssigned: true,
          isBookmarked: false,
          isCompleted: true,
        },
        {
          id: 2,
          name: "Advanced TypeScript",
          summary: "Types",
          content: "Content",
          status: "ACTIVE",
          isAssigned: false,
          isBookmarked: true,
          isCompleted: false,
        },
      ],
      bookmarkedCourseIds: new Set([2]),
      completedCourseIds: new Set([1]),
    });
  });

  it("returns null for employee course selection when the employee has no organization", async () => {
    requireEmployeeMock.mockResolvedValue(
      createSession({ organizationId: null }),
    );

    await expect(requireEmployeeCourseSelection(6)).resolves.toBeNull();
    expect(prismaMock.course.findUnique).not.toHaveBeenCalled();
  });

  it("returns the employee course selection when the course is active and accessible", async () => {
    requireEmployeeMock.mockResolvedValue(createSession());
    prismaMock.course.findUnique.mockResolvedValue({ id: 6, status: "ACTIVE" });
    prismaMock.organizationCourse.findUnique.mockResolvedValue({ courseId: 6 });
    prismaMock.bookmark.findUnique.mockResolvedValue(null);
    prismaMock.completedCourse.findUnique.mockResolvedValue(null);

    await expect(requireEmployeeCourseSelection(6)).resolves.toEqual({
      userId: 12,
      organizationId: 7,
      courseId: 6,
    });
  });

  it("returns a bookmark selection only for active courses", async () => {
    requireEmployeeMock.mockResolvedValue(createSession());
    prismaMock.course.findUnique.mockResolvedValueOnce({
      id: 3,
      status: "ACTIVE",
    });
    prismaMock.course.findUnique.mockResolvedValueOnce({
      id: 4,
      status: "DEACTIVATED",
    });

    await expect(requireEmployeeCourseBookmarkSelection(3)).resolves.toEqual({
      userId: 12,
      organizationId: 7,
      courseId: 3,
    });
    await expect(requireEmployeeCourseBookmarkSelection(4)).resolves.toBeNull();
  });

  it("deletes an existing bookmark and creates one when missing", async () => {
    prismaMock.bookmark.findUnique.mockResolvedValueOnce({ courseId: 8 });
    prismaMock.bookmark.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.bookmark.findUnique.mockResolvedValueOnce(null);
    prismaMock.bookmark.upsert.mockResolvedValue({
      userId: 12,
      courseId: 8,
    });

    await expect(
      toggleEmployeeCourseBookmark({
        userId: 12,
        organizationId: 7,
        courseId: 8,
      }),
    ).resolves.toEqual({ count: 1 });

    await expect(
      toggleEmployeeCourseBookmark({
        userId: 12,
        organizationId: 7,
        courseId: 8,
      }),
    ).resolves.toEqual({ userId: 12, courseId: 8 });
  });

  it("deletes an existing completion and creates one when missing", async () => {
    prismaMock.completedCourse.findUnique.mockResolvedValueOnce({ courseId: 2 });
    prismaMock.completedCourse.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.completedCourse.findUnique.mockResolvedValueOnce(null);
    prismaMock.completedCourse.upsert.mockResolvedValue({
      userId: 12,
      courseId: 2,
    });

    await expect(
      toggleEmployeeCourseCompletion({
        userId: 12,
        organizationId: 7,
        courseId: 2,
      }),
    ).resolves.toEqual({ count: 1 });

    await expect(
      toggleEmployeeCourseCompletion({
        userId: 12,
        organizationId: 7,
        courseId: 2,
      }),
    ).resolves.toEqual({ userId: 12, courseId: 2 });
  });
});

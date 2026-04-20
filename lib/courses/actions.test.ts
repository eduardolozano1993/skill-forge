import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  revalidatePathMock,
  notFoundMock,
  redirectMock,
  requireAdminMock,
  acquireCourseEditLockMock,
  refreshCourseEditLockMock,
  releaseCourseEditLockMock,
  deleteCacheKeysMock,
  getManagerDashboardCacheKeyMock,
  updateCourseContentSafeParseMock,
  toggleCourseSelectionSafeParseMock,
  findCourseByIdMock,
  getVisibleCoursesForUserMock,
  requireEmployeeCourseBookmarkSelectionMock,
  requireEmployeeCourseSelectionMock,
  toggleEmployeeCourseBookmarkMock,
  toggleEmployeeCourseCompletionMock,
  updateCourseMock,
} = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  notFoundMock: vi.fn(),
  redirectMock: vi.fn(),
  requireAdminMock: vi.fn(),
  acquireCourseEditLockMock: vi.fn(),
  refreshCourseEditLockMock: vi.fn(),
  releaseCourseEditLockMock: vi.fn(),
  deleteCacheKeysMock: vi.fn(),
  getManagerDashboardCacheKeyMock: vi.fn(),
  updateCourseContentSafeParseMock: vi.fn(),
  toggleCourseSelectionSafeParseMock: vi.fn(),
  findCourseByIdMock: vi.fn(),
  getVisibleCoursesForUserMock: vi.fn(),
  requireEmployeeCourseBookmarkSelectionMock: vi.fn(),
  requireEmployeeCourseSelectionMock: vi.fn(),
  toggleEmployeeCourseBookmarkMock: vi.fn(),
  toggleEmployeeCourseCompletionMock: vi.fn(),
  updateCourseMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
  redirect: redirectMock,
}));

vi.mock("@/lib/auth/auth", () => ({
  requireAdmin: requireAdminMock,
}));

vi.mock("@/lib/courses/edit-lock", () => ({
  acquireCourseEditLock: acquireCourseEditLockMock,
  refreshCourseEditLock: refreshCourseEditLockMock,
  releaseCourseEditLock: releaseCourseEditLockMock,
}));

vi.mock("@/lib/utils/redis/cache", () => ({
  deleteCacheKeys: deleteCacheKeysMock,
  getManagerDashboardCacheKey: getManagerDashboardCacheKeyMock,
}));

vi.mock("./schemas", () => ({
  updateCourseContentSchema: {
    safeParse: updateCourseContentSafeParseMock,
  },
  toggleCourseSelectionSchema: {
    safeParse: toggleCourseSelectionSafeParseMock,
  },
}));

vi.mock("./queries", () => ({
  findCourseById: findCourseByIdMock,
  getVisibleCoursesForUser: getVisibleCoursesForUserMock,
  requireEmployeeCourseBookmarkSelection:
    requireEmployeeCourseBookmarkSelectionMock,
  requireEmployeeCourseSelection: requireEmployeeCourseSelectionMock,
  toggleEmployeeCourseBookmark: toggleEmployeeCourseBookmarkMock,
  toggleEmployeeCourseCompletion: toggleEmployeeCourseCompletionMock,
  updateCourse: updateCourseMock,
}));

import {
  getDashboardCoursesAction,
  toggleCourseBookmarkAction,
  toggleCourseCompletionAction,
  updateCourseContentAction,
} from "./actions";

describe("course actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    notFoundMock.mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
    redirectMock.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
    getManagerDashboardCacheKeyMock.mockImplementation(
      (organizationId: number) => `cache:manager:${organizationId}:dashboard`,
    );
    acquireCourseEditLockMock.mockResolvedValue({
      status: "acquired",
      holderUserId: 1,
      expiresInSeconds: 120,
    });
  });

  it("calls notFound when updateCourseContentAction receives invalid form data", async () => {
    const formData = new FormData();
    const session = { user: { id: "1", userType: "ADMIN" } };

    requireAdminMock.mockResolvedValue(session);
    updateCourseContentSafeParseMock.mockReturnValue({ success: false });

    await expect(updateCourseContentAction({}, formData)).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );

    expect(requireAdminMock).toHaveBeenCalledTimes(1);
    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(findCourseByIdMock).not.toHaveBeenCalled();
  });

  it("calls notFound when the course does not exist during content update", async () => {
    const formData = new FormData();
    const session = { user: { id: "1", userType: "ADMIN" } };

    formData.set("courseId", "15");
    formData.set("contentVersion", "2");
    formData.set("content", "Updated content");

    requireAdminMock.mockResolvedValue(session);
    updateCourseContentSafeParseMock.mockReturnValue({
      success: true,
      data: {
        courseId: 15,
        contentVersion: 2,
        content: "Updated content",
      },
    });
    findCourseByIdMock.mockResolvedValue(null);

    await expect(updateCourseContentAction({}, formData)).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );

    expect(findCourseByIdMock).toHaveBeenCalledWith(15, session);
    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(updateCourseMock).not.toHaveBeenCalled();
  });

  it("updates the course, revalidates pages, and redirects on successful content update", async () => {
    const formData = new FormData();
    const session = { user: { id: "1", userType: "ADMIN" } };

    formData.set("courseId", "15");
    formData.set("contentVersion", "2");
    formData.set("content", "Updated content");

    requireAdminMock.mockResolvedValue(session);
    updateCourseContentSafeParseMock.mockReturnValue({
      success: true,
      data: {
        courseId: 15,
        contentVersion: 2,
        content: "Updated content",
      },
    });
    findCourseByIdMock.mockResolvedValue({ id: 15 });
    updateCourseMock.mockResolvedValue({ id: 15, content: "Updated content" });

    await expect(updateCourseContentAction({}, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(updateCourseMock).toHaveBeenCalledWith(15, {
      content: "Updated content",
      expectedContentVersion: 2,
    });
    expect(releaseCourseEditLockMock).toHaveBeenCalledWith(15, 1);
    expect(revalidatePathMock).toHaveBeenNthCalledWith(1, "/courses");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(2, "/courses/15");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(
      3,
      "/admin/courses/15/edit",
    );
    expect(redirectMock).toHaveBeenCalledWith("/courses/15");
  });

  it("returns an error when another admin owns the course edit lock", async () => {
    const formData = new FormData();
    const session = { user: { id: "1", userType: "ADMIN" } };

    formData.set("courseId", "15");
    formData.set("contentVersion", "2");
    formData.set("content", "Updated content");

    requireAdminMock.mockResolvedValue(session);
    updateCourseContentSafeParseMock.mockReturnValue({
      success: true,
      data: {
        courseId: 15,
        contentVersion: 2,
        content: "Updated content",
      },
    });
    findCourseByIdMock.mockResolvedValue({ id: 15 });
    acquireCourseEditLockMock.mockResolvedValue({
      status: "conflict",
      holderUserId: 9,
      expiresInSeconds: 120,
    });

    await expect(updateCourseContentAction({}, formData)).resolves.toEqual({
      error:
        "Another admin is already editing this course. Refresh the page and try again once the lock clears.",
    });

    expect(updateCourseMock).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("returns an error when the submitted content version is stale", async () => {
    const formData = new FormData();
    const session = { user: { id: "1", userType: "ADMIN" } };

    formData.set("courseId", "15");
    formData.set("contentVersion", "2");
    formData.set("content", "Updated content");

    requireAdminMock.mockResolvedValue(session);
    updateCourseContentSafeParseMock.mockReturnValue({
      success: true,
      data: {
        courseId: 15,
        contentVersion: 2,
        content: "Updated content",
      },
    });
    findCourseByIdMock.mockResolvedValue({ id: 15 });
    updateCourseMock.mockResolvedValue(null);

    await expect(updateCourseContentAction({}, formData)).resolves.toEqual({
      error:
        "This course was updated from another session. Refresh the page to load the latest content before saving again.",
    });

    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("builds dashboard course groups from visible course state", async () => {
    getVisibleCoursesForUserMock.mockResolvedValue({
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

    await expect(getDashboardCoursesAction()).resolves.toEqual({
      assignedCourses: [
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
      ],
      bookmarkedCourses: [
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
      completedCourses: [
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
      ],
    });
  });

  it("returns an error when bookmark toggle receives an invalid course id", async () => {
    toggleCourseSelectionSafeParseMock.mockReturnValue({ success: false });

    await expect(toggleCourseBookmarkAction(0)).resolves.toEqual({
      error: "Invalid course selection.",
    });

    expect(requireEmployeeCourseBookmarkSelectionMock).not.toHaveBeenCalled();
    expect(toggleEmployeeCourseBookmarkMock).not.toHaveBeenCalled();
  });

  it("returns an error when bookmark toggle cannot load a valid selection", async () => {
    toggleCourseSelectionSafeParseMock.mockReturnValue({
      success: true,
      data: { courseId: 11 },
    });
    requireEmployeeCourseBookmarkSelectionMock.mockResolvedValue(null);

    await expect(toggleCourseBookmarkAction(11)).resolves.toEqual({
      error: "Course access is no longer available.",
    });

    expect(requireEmployeeCourseBookmarkSelectionMock).toHaveBeenCalledWith(11);
    expect(toggleEmployeeCourseBookmarkMock).not.toHaveBeenCalled();
  });

  it("toggles bookmark state, clears cache, and revalidates related paths", async () => {
    const selection = {
      userId: 12,
      organizationId: 7,
      courseId: 11,
    };

    toggleCourseSelectionSafeParseMock.mockReturnValue({
      success: true,
      data: { courseId: 11 },
    });
    requireEmployeeCourseBookmarkSelectionMock.mockResolvedValue(selection);
    toggleEmployeeCourseBookmarkMock.mockResolvedValue({ count: 1 });

    await expect(toggleCourseBookmarkAction(11)).resolves.toEqual({
      success: true,
    });

    expect(toggleEmployeeCourseBookmarkMock).toHaveBeenCalledWith(selection);
    expect(getManagerDashboardCacheKeyMock).toHaveBeenCalledWith(7);
    expect(deleteCacheKeysMock).toHaveBeenCalledWith([
      "cache:manager:7:dashboard",
    ]);
    expect(revalidatePathMock).toHaveBeenNthCalledWith(1, "/dashboard");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(2, "/courses");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(3, "/courses/11");
  });

  it("toggles completion state without manager cache key when no organization is present", async () => {
    const selection = {
      userId: 12,
      organizationId: null,
      courseId: 4,
    };

    toggleCourseSelectionSafeParseMock.mockReturnValue({
      success: true,
      data: { courseId: 4 },
    });
    requireEmployeeCourseSelectionMock.mockResolvedValue(selection);
    toggleEmployeeCourseCompletionMock.mockResolvedValue({ count: 1 });

    await expect(toggleCourseCompletionAction(4)).resolves.toEqual({
      success: true,
    });

    expect(toggleEmployeeCourseCompletionMock).toHaveBeenCalledWith(selection);
    expect(getManagerDashboardCacheKeyMock).not.toHaveBeenCalled();
    expect(deleteCacheKeysMock).toHaveBeenCalledWith([null]);
    expect(revalidatePathMock).toHaveBeenNthCalledWith(1, "/dashboard");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(2, "/courses");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(3, "/courses/4");
  });
});

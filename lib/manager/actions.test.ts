import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  revalidatePathMock,
  safeParseMock,
  assignCourseToOrganizationMock,
  assignBookmarkedCourseMock,
  removeAssignedCourseFromOrganizationMock,
} = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  safeParseMock: vi.fn(),
  assignCourseToOrganizationMock: vi.fn(),
  assignBookmarkedCourseMock: vi.fn(),
  removeAssignedCourseFromOrganizationMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("./schemas", () => ({
  managerCourseSelectionSchema: {
    safeParse: safeParseMock,
  },
}));

vi.mock("./services", () => ({
  assignCourseToOrganization: assignCourseToOrganizationMock,
  assignBookmarkedCourse: assignBookmarkedCourseMock,
  removeAssignedCourseFromOrganization: removeAssignedCourseFromOrganizationMock,
}));

import {
  assignBookmarkedCourseToOrganizationAction,
  assignCourseToOrganizationAction,
  removeAssignedCourseFromOrganizationAction,
} from "./actions";

describe("manager actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an error when the manager course selection is invalid", async () => {
    safeParseMock.mockReturnValue({ success: false });

    await expect(assignCourseToOrganizationAction(0)).resolves.toEqual({
      success: false,
      error: "Invalid course selection.",
    });

    expect(assignCourseToOrganizationMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("delegates assign course actions and revalidates manager pages on success", async () => {
    safeParseMock.mockReturnValue({
      success: true,
      data: {
        courseId: 12,
      },
    });
    assignCourseToOrganizationMock.mockResolvedValue({
      success: true,
      assigned: true,
      alreadyAssigned: false,
    });

    await expect(assignCourseToOrganizationAction(12)).resolves.toEqual({
      success: true,
      assigned: true,
      alreadyAssigned: false,
    });

    expect(assignCourseToOrganizationMock).toHaveBeenCalledWith(12);
    expect(revalidatePathMock).toHaveBeenNthCalledWith(1, "/manager");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(2, "/courses");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(3, "/dashboard");
  });

  it("delegates bookmarked course assignment without revalidating failed results", async () => {
    safeParseMock.mockReturnValue({
      success: true,
      data: {
        courseId: 8,
      },
    });
    assignBookmarkedCourseMock.mockResolvedValue({
      success: false,
      error: "Course not found.",
    });

    await expect(
      assignBookmarkedCourseToOrganizationAction(8),
    ).resolves.toEqual({
      success: false,
      error: "Course not found.",
    });

    expect(assignBookmarkedCourseMock).toHaveBeenCalledWith(8);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("delegates assigned course removal and revalidates on success", async () => {
    safeParseMock.mockReturnValue({
      success: true,
      data: {
        courseId: 5,
      },
    });
    removeAssignedCourseFromOrganizationMock.mockResolvedValue({
      success: true,
    });

    await expect(
      removeAssignedCourseFromOrganizationAction(5),
    ).resolves.toEqual({
      success: true,
    });

    expect(removeAssignedCourseFromOrganizationMock).toHaveBeenCalledWith(5);
    expect(revalidatePathMock).toHaveBeenNthCalledWith(1, "/manager");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(2, "/courses");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(3, "/dashboard");
  });
});

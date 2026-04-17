import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireAuthMock,
  requireAdminMock,
  normalizeTableSearchMock,
  normalizeTablePageMock,
  findCourseByIdMock,
  findActiveCoursesByIdMock,
  queryAdminCoursesMock,
  queryCoursesMock,
} = vi.hoisted(() => ({
  requireAuthMock: vi.fn(),
  requireAdminMock: vi.fn(),
  normalizeTableSearchMock: vi.fn(),
  normalizeTablePageMock: vi.fn(),
  findCourseByIdMock: vi.fn(),
  findActiveCoursesByIdMock: vi.fn(),
  queryAdminCoursesMock: vi.fn(),
  queryCoursesMock: vi.fn(),
}));

vi.mock("@/lib/auth/auth", () => ({
  requireAuth: requireAuthMock,
  requireAdmin: requireAdminMock,
}));

vi.mock("@/lib/table/utils", () => ({
  normalizeTableSearch: normalizeTableSearchMock,
  normalizeTablePage: normalizeTablePageMock,
}));

vi.mock("./queries", () => ({
  findActiveCoursesById: findActiveCoursesByIdMock,
  findCourseById: findCourseByIdMock,
  queryAdminCourses: queryAdminCoursesMock,
  queryCourses: queryCoursesMock,
}));

import {
  getAdminCoursesTableData,
  getCourseById,
  getCourses,
} from "./services";

describe("course services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads any course for admins in getCourseById", async () => {
    const session = { user: { userType: "ADMIN" } };
    const course = { id: 10, name: "React Fundamentals" };

    requireAuthMock.mockResolvedValue(session);
    findCourseByIdMock.mockResolvedValue(course);

    await expect(getCourseById(10)).resolves.toBe(course);

    expect(requireAuthMock).toHaveBeenCalledTimes(1);
    expect(findCourseByIdMock).toHaveBeenCalledWith(10, session);
    expect(findActiveCoursesByIdMock).not.toHaveBeenCalled();
  });

  it("loads only active courses for non-admin users in getCourseById", async () => {
    const session = { user: { userType: "EMPLOYEE" } };
    const course = { id: 4, name: "Node.js API Design" };

    requireAuthMock.mockResolvedValue(session);
    findActiveCoursesByIdMock.mockResolvedValue(course);

    await expect(getCourseById(4)).resolves.toBe(course);

    expect(requireAuthMock).toHaveBeenCalledTimes(1);
    expect(findActiveCoursesByIdMock).toHaveBeenCalledWith(4, session);
    expect(findCourseByIdMock).not.toHaveBeenCalled();
  });

  it("normalizes admin table params before querying courses", async () => {
    const result = { search: "react", rows: [], pagination: { page: 2 } };

    requireAdminMock.mockResolvedValue(undefined);
    normalizeTableSearchMock.mockReturnValue("react");
    normalizeTablePageMock.mockReturnValue(2);
    queryAdminCoursesMock.mockResolvedValue(result);

    await expect(getAdminCoursesTableData("  React  ", 2.9)).resolves.toBe(
      result,
    );

    expect(requireAdminMock).toHaveBeenCalledTimes(1);
    expect(normalizeTableSearchMock).toHaveBeenCalledWith("  React  ");
    expect(normalizeTablePageMock).toHaveBeenCalledWith(2.9);
    expect(queryAdminCoursesMock).toHaveBeenCalledWith("react", 2);
  });

  it("normalizes params and queries courses for the authenticated user", async () => {
    const session = { user: { userType: "MANAGER" } };
    const result = { search: "", rows: [] };

    requireAuthMock.mockResolvedValue(session);
    normalizeTableSearchMock.mockReturnValue("");
    normalizeTablePageMock.mockReturnValue(1);
    queryCoursesMock.mockResolvedValue(result);

    await expect(getCourses(null, NaN)).resolves.toBe(result);

    expect(requireAuthMock).toHaveBeenCalledTimes(1);
    expect(normalizeTableSearchMock).toHaveBeenCalledWith(null);
    expect(normalizeTablePageMock).toHaveBeenCalledWith(NaN);
    expect(queryCoursesMock).toHaveBeenCalledWith(session, "", 1);
  });
});

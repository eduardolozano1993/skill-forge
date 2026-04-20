import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireAdminMock,
  normalizeTableSearchMock,
  normalizeTablePageMock,
  queryUsersMock,
} = vi.hoisted(() => ({
  requireAdminMock: vi.fn(),
  normalizeTableSearchMock: vi.fn(),
  normalizeTablePageMock: vi.fn(),
  queryUsersMock: vi.fn(),
}));

vi.mock("@/lib/auth/auth", () => ({
  requireAdmin: requireAdminMock,
}));

vi.mock("@/lib/utils/table/table", () => ({
  normalizeTableSearch: normalizeTableSearchMock,
  normalizeTablePage: normalizeTablePageMock,
}));

vi.mock("./queries", () => ({
  queryUsers: queryUsersMock,
}));

import { getUsers } from "./services";

describe("user services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires admin access, normalizes params, and queries users", async () => {
    const result = {
      search: "alice",
      rows: [],
      pagination: {
        page: 2,
        pageSize: 10,
        totalRows: 0,
        totalPages: 0,
        hasPreviousPage: true,
        hasNextPage: false,
      },
    };

    requireAdminMock.mockResolvedValue(undefined);
    normalizeTableSearchMock.mockReturnValue("alice");
    normalizeTablePageMock.mockReturnValue(2);
    queryUsersMock.mockResolvedValue(result);

    await expect(getUsers("  Alice  ", 2.9)).resolves.toBe(result);

    expect(requireAdminMock).toHaveBeenCalledTimes(1);
    expect(normalizeTableSearchMock).toHaveBeenCalledWith("  Alice  ");
    expect(normalizeTablePageMock).toHaveBeenCalledWith(2.9);
    expect(queryUsersMock).toHaveBeenCalledWith("alice", 2);
  });

  it("normalizes nullish params before querying users", async () => {
    const result = {
      search: "",
      rows: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalRows: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    requireAdminMock.mockResolvedValue(undefined);
    normalizeTableSearchMock.mockReturnValue("");
    normalizeTablePageMock.mockReturnValue(1);
    queryUsersMock.mockResolvedValue(result);

    await expect(getUsers(null, NaN)).resolves.toBe(result);

    expect(requireAdminMock).toHaveBeenCalledTimes(1);
    expect(normalizeTableSearchMock).toHaveBeenCalledWith(null);
    expect(normalizeTablePageMock).toHaveBeenCalledWith(NaN);
    expect(queryUsersMock).toHaveBeenCalledWith("", 1);
  });
});

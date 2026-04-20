import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/utils/prisma/prisma", () => ({
  prisma: prismaMock,
}));

import { queryUsers } from "./queries";

describe("user queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries users with search, pagination, and row serialization", async () => {
    const createdAt = new Date("2026-04-15T12:00:00.000Z");

    prismaMock.user.count.mockResolvedValue(21);
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 5,
        name: "Alice Admin",
        displayName: "Alice",
        email: "alice@example.com",
        phone: "555-0100",
        userType: "ADMIN",
        status: "ACTIVE",
        createdAt,
        organization: {
          id: 9,
          name: "Skill Forge",
        },
      },
      {
        id: 6,
        name: "Bob Builder",
        displayName: "Bob",
        email: "bob@example.com",
        phone: "555-0101",
        userType: "EMPLOYEE",
        status: "DEACTIVATED",
        createdAt,
        organization: null,
      },
    ]);

    await expect(queryUsers("alice", 2)).resolves.toEqual({
      search: "alice",
      rows: [
        {
          id: 5,
          name: "Alice Admin",
          displayName: "Alice",
          email: "alice@example.com",
          phone: "555-0100",
          userType: "ADMIN",
          status: "ACTIVE",
          organizationId: 9,
          organizationName: "Skill Forge",
          createdAt,
        },
        {
          id: 6,
          name: "Bob Builder",
          displayName: "Bob",
          email: "bob@example.com",
          phone: "555-0101",
          userType: "EMPLOYEE",
          status: "DEACTIVATED",
          organizationId: null,
          organizationName: null,
          createdAt,
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

    expect(prismaMock.user.count).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            name: {
              contains: "alice",
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: "alice",
              mode: "insensitive",
            },
          },
        ],
      },
    });

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            name: {
              contains: "alice",
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: "alice",
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        phone: true,
        userType: true,
        status: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          name: "asc",
        },
        {
          id: "asc",
        },
      ],
      skip: 10,
      take: 10,
    });
  });

  it("returns first-page empty results without skipping rows when no users match", async () => {
    prismaMock.user.count.mockResolvedValue(0);
    prismaMock.user.findMany.mockResolvedValue([]);

    await expect(queryUsers("", 4)).resolves.toEqual({
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
    });

    expect(prismaMock.user.count).toHaveBeenCalledWith({
      where: {},
    });

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {},
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        phone: true,
        userType: true,
        status: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          name: "asc",
        },
        {
          id: "asc",
        },
      ],
      skip: 0,
      take: 10,
    });
  });
});

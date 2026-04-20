import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/utils/prisma/prisma";
import {
  buildTablePagination,
  DEFAULT_TABLE_PAGE_SIZE,
  TableResult,
} from "@/lib/utils/table/table";
import type { UsersTableRow } from "./types";

function buildUserSearchWhere(search: string): Prisma.UserWhereInput {
  return search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};
}

function buildUserOrderBy(): Prisma.UserOrderByWithRelationInput[] {
  return [
    {
      name: "asc",
    },
    {
      id: "asc",
    },
  ];
}

function buildPaginationArgs({
  totalRows,
  page,
  pageSize,
}: {
  totalRows: number;
  page: number;
  pageSize: number;
}) {
  const pagination = buildTablePagination(totalRows, page, pageSize);
  const skip =
    totalRows === 0 ? 0 : (pagination.page - 1) * pagination.pageSize;

  return {
    pagination,
    skip,
    take: pagination.pageSize,
  };
}

function toUsersTableRow(user: {
  id: number;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  userType: UsersTableRow["userType"];
  status: UsersTableRow["status"];
  createdAt: Date;
  organization: {
    id: number;
    name: string;
  } | null;
}): UsersTableRow {
  return {
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    email: user.email,
    phone: user.phone,
    userType: user.userType,
    status: user.status,
    organizationId: user.organization?.id ?? null,
    organizationName: user.organization?.name ?? null,
    createdAt: user.createdAt,
  };
}

export async function queryUsers(
  search: string,
  page: number,
): Promise<TableResult<UsersTableRow>> {
  const where = buildUserSearchWhere(search);

  const totalRows = await prisma.user.count({
    where,
  });

  const { pagination, skip, take } = buildPaginationArgs({
    totalRows,
    page,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });

  const users = await prisma.user.findMany({
    where,
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
    orderBy: buildUserOrderBy(),
    skip,
    take,
  });

  const rows = users.map<UsersTableRow>(toUsersTableRow);

  return {
    search,
    rows,
    pagination,
  };
}

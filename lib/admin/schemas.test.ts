import { describe, expect, it } from "vitest";

import {
  adminLogLimitSchema,
  adminStatusSchema,
  adminTableSearchSchema,
  updateAdminCourseStatusSchema,
  updateAdminOrganizationStatusSchema,
  updateAdminUserStatusSchema,
} from "./schemas";

describe("admin schemas", () => {
  it("accepts the supported admin status values", () => {
    expect(adminStatusSchema.safeParse("ACTIVE")).toEqual({
      success: true,
      data: "ACTIVE",
    });

    expect(adminStatusSchema.safeParse("DEACTIVATED")).toEqual({
      success: true,
      data: "DEACTIVATED",
    });
  });

  it("rejects unsupported admin status values", () => {
    expect(adminStatusSchema.safeParse("PENDING").success).toBe(false);
  });

  it("accepts nullable and omitted table searches", () => {
    expect(adminTableSearchSchema.safeParse({ search: "react" })).toEqual({
      success: true,
      data: {
        search: "react",
      },
    });

    expect(adminTableSearchSchema.safeParse({ search: null })).toEqual({
      success: true,
      data: {
        search: null,
      },
    });

    expect(adminTableSearchSchema.safeParse({})).toEqual({
      success: true,
      data: {},
    });
  });

  it("defaults the log limit and rejects out-of-range values", () => {
    expect(adminLogLimitSchema.safeParse({})).toEqual({
      success: true,
      data: {
        limit: 500,
      },
    });

    expect(adminLogLimitSchema.safeParse({ limit: 0 })).toEqual({
      success: true,
      data: {
        limit: 0,
      },
    });

    expect(adminLogLimitSchema.safeParse({ limit: 501 }).success).toBe(false);
    expect(adminLogLimitSchema.safeParse({ limit: -1 }).success).toBe(false);
    expect(adminLogLimitSchema.safeParse({ limit: 2.5 }).success).toBe(false);
  });

  it("validates user, organization, and course status update payloads", () => {
    expect(
      updateAdminUserStatusSchema.safeParse({
        userId: 7,
        status: "ACTIVE",
      }),
    ).toEqual({
      success: true,
      data: {
        userId: 7,
        status: "ACTIVE",
      },
    });

    expect(
      updateAdminOrganizationStatusSchema.safeParse({
        organizationId: 4,
        status: "DEACTIVATED",
      }),
    ).toEqual({
      success: true,
      data: {
        organizationId: 4,
        status: "DEACTIVATED",
      },
    });

    expect(
      updateAdminCourseStatusSchema.safeParse({
        courseId: 2,
        status: "ACTIVE",
      }),
    ).toEqual({
      success: true,
      data: {
        courseId: 2,
        status: "ACTIVE",
      },
    });
  });

  it("rejects invalid identifiers in status update payloads", () => {
    expect(
      updateAdminUserStatusSchema.safeParse({
        userId: 0,
        status: "ACTIVE",
      }).success,
    ).toBe(false);

    expect(
      updateAdminOrganizationStatusSchema.safeParse({
        organizationId: -1,
        status: "ACTIVE",
      }).success,
    ).toBe(false);

    expect(
      updateAdminCourseStatusSchema.safeParse({
        courseId: 1.2,
        status: "ACTIVE",
      }).success,
    ).toBe(false);
  });
});

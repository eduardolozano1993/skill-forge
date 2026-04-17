import { describe, expect, it } from "vitest";

import {
  DEFAULT_TABLE_PAGE_SIZE,
  buildTablePagination,
  getSingleQueryParam,
  matchesSearch,
  normalizeTablePage,
  normalizeTableSearch,
  parsePageQueryParam,
} from "./utils";

describe("getSingleQueryParam", () => {
  it("returns the first value when given an array", () => {
    expect(getSingleQueryParam(["users", "ignored"])).toBe("users");
  });

  it("returns an empty string for an empty array or missing input", () => {
    expect(getSingleQueryParam([])).toBe("");
    expect(getSingleQueryParam()).toBe("");
  });

  it("returns the string value unchanged", () => {
    expect(getSingleQueryParam("users")).toBe("users");
  });
});

describe("normalizeTableSearch", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeTableSearch("  admin users  ")).toBe("admin users");
  });

  it("returns an empty string for nullish values", () => {
    expect(normalizeTableSearch(null)).toBe("");
    expect(normalizeTableSearch(undefined)).toBe("");
  });
});

describe("matchesSearch", () => {
  it("returns true when the search is empty", () => {
    expect(matchesSearch("", ["Alice", "Bob"])).toBe(true);
  });

  it("matches values case-insensitively across strings and numbers", () => {
    expect(matchesSearch("alice", ["Alice Admin", 42])).toBe(true);
    expect(matchesSearch("42", ["Alice Admin", 42])).toBe(true);
  });

  it("treats null values as empty strings and returns false when nothing matches", () => {
    expect(matchesSearch("zeta", [null, "Alpha", 7])).toBe(false);
  });
});

describe("parsePageQueryParam", () => {
  it("parses a valid page from a string or array", () => {
    expect(parsePageQueryParam("3")).toBe(3);
    expect(parsePageQueryParam(["4", "9"])).toBe(4);
  });

  it("returns page 1 for invalid, missing, or out-of-range values", () => {
    expect(parsePageQueryParam("0")).toBe(1);
    expect(parsePageQueryParam("-2")).toBe(1);
    expect(parsePageQueryParam("abc")).toBe(1);
    expect(parsePageQueryParam()).toBe(1);
  });
});

describe("normalizeTablePage", () => {
  it("floors valid numeric page values", () => {
    expect(normalizeTablePage(2.9)).toBe(2);
  });

  it("returns page 1 for nullish, non-finite, or out-of-range values", () => {
    expect(normalizeTablePage(null)).toBe(1);
    expect(normalizeTablePage(undefined)).toBe(1);
    expect(normalizeTablePage(NaN)).toBe(1);
    expect(normalizeTablePage(0)).toBe(1);
    expect(normalizeTablePage(-3)).toBe(1);
  });
});

describe("buildTablePagination", () => {
  it("uses the default page size and computes navigation flags", () => {
    expect(buildTablePagination(25, 2)).toEqual({
      page: 2,
      pageSize: DEFAULT_TABLE_PAGE_SIZE,
      totalRows: 25,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: true,
    });
  });

  it("clamps the requested page to the last available page", () => {
    expect(buildTablePagination(21, 9, 10)).toEqual({
      page: 3,
      pageSize: 10,
      totalRows: 21,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: false,
    });
  });

  it("returns page 1 and zero total pages when there are no rows", () => {
    expect(buildTablePagination(0, 4, 10)).toEqual({
      page: 1,
      pageSize: 10,
      totalRows: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });
});

import { describe, expect, it } from "vitest";

import { getDeactivatedAccountDialogContent } from "./deactivated-user";

describe("getDeactivatedAccountDialogContent", () => {
  it("returns the manager support message for deactivated managers", () => {
    expect(getDeactivatedAccountDialogContent("MANAGER")).toEqual({
      title: "Account deactivated",
      description:
        "Your account has been deactivated. If this is a mistake, please contact Skill Forge support.",
    });
  });

  it("returns the organization manager message for deactivated employees", () => {
    expect(getDeactivatedAccountDialogContent("EMPLOYEE")).toEqual({
      title: "Account deactivated",
      description:
        "Your account has been deactivated. If this is a mistake, please contact your organization manager.",
    });
  });
});

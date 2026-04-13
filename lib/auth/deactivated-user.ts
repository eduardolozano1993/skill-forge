type UserType = "ADMIN" | "MANAGER" | "EMPLOYEE";

export type DeactivatedAccountDialogContent = {
  title: string;
  description: string;
};

export function getDeactivatedAccountDialogContent(
  userType: UserType,
): DeactivatedAccountDialogContent {
  if (userType === "MANAGER") {
    return {
      title: "Account deactivated",
      description:
        "Your account has been deactivated. If this is a mistake, please contact Skill Forge support.",
    };
  }

  return {
    title: "Account deactivated",
    description:
      "Your account has been deactivated. If this is a mistake, please contact your organization manager.",
  };
}

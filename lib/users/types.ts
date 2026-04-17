export type UserStatus = "ACTIVE" | "DEACTIVATED";
export type UserType = "ADMIN" | "MANAGER" | "EMPLOYEE";

export type UsersTableRow = {
  id: number;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  userType: UserType;
  status: UserStatus;
  organizationId: number | null;
  organizationName: string | null;
  createdAt: Date;
};

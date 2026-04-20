import { AdminTableCourseRow } from "../courses/types";
import { UsersTableRow } from "../users/types";
import { TableResult } from "../utils/table/table";

export type AdminUserStatus = "ACTIVE" | "DEACTIVATED";
export type AdminOrganizationStatus = "ACTIVE" | "DEACTIVATED";
export type AdminCourseStatus = "ACTIVE" | "DEACTIVATED";

export type AdminPlatformSummary = {
  totalUsers: number;
  totalCourses: number;
  totalOrganizations: number;
  totalCompletedCourses: number;
};

export type AdminOrganizationRow = {
  id: number;
  name: string;
  status: AdminOrganizationStatus;
  ownerUserId: number;
  ownerDisplayName: string;
  ownerEmail: string;
  memberCount: number;
  assignedCourseCount: number;
  createdAt: Date;
};

export type AdminDashboardSearchFilters = {
  usersSearch?: string | null;
  organizationsSearch?: string | null;
  coursesSearch?: string | null;
};

export type AdminSignInLogData = {
  exists: boolean;
  lines: string[];
};

export type AdminDashboardData = {
  summary: AdminPlatformSummary;
  users: TableResult<UsersTableRow>;
  organizations: TableResult<AdminOrganizationRow>;
  courses: TableResult<AdminTableCourseRow>;
};

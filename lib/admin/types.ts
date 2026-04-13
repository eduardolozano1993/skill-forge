export type AdminUserStatus = "ACTIVE" | "DEACTIVATED";
export type AdminOrganizationStatus = "ACTIVE" | "DEACTIVATED";

export type AdminPlatformSummary = {
  totalUsers: number;
  totalCourses: number;
  totalOrganizations: number;
  totalCompletedCourses: number;
};

export type AdminUserRow = {
  id: number;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  userType: "ADMIN" | "MANAGER" | "EMPLOYEE";
  status: AdminUserStatus;
  organizationId: number | null;
  organizationName: string | null;
  createdAt: Date;
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

export type AdminCourseRow = {
  id: number;
  title: string;
  summary: string;
  assignedOrganizationCount: number;
  completedUserCount: number;
  bookmarkCount: number;
  createdAt: Date;
};

export type AdminTableResult<Row> = {
  search: string;
  rows: Row[];
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
  users: AdminTableResult<AdminUserRow>;
  organizations: AdminTableResult<AdminOrganizationRow>;
  courses: AdminTableResult<AdminCourseRow>;
};

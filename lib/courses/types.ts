export type AdminTableCourseRow = {
  id: number;
  name: string;
  summary: string;
  status: "ACTIVE" | "DEACTIVATED";
  assignedOrganizationCount: number;
  completedUserCount: number;
  bookmarkCount: number;
};

export type CourseDetail = {
  id: number;
  name: string;
  summary: string;
  content: string;
  status: "ACTIVE" | "DEACTIVATED";
  isAssigned: boolean;
  isBookmarked: boolean;
  isCompleted: boolean;
};

export type DashboardCourses = {
  assignedCourses: CourseDetail[];
  bookmarkedCourses: CourseDetail[];
  completedCourses: CourseDetail[];
};

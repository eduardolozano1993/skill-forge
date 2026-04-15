export type CourseDetail = {
  id: number;
  name: string;
  summary: string;
  content: string;
  status: "ACTIVE" | "DEACTIVATED";
};

export type AdminTableCourseRow = {
  id: number;
  name: string;
  summary: string;
  status: "ACTIVE" | "DEACTIVATED";
  assignedOrganizationCount: number;
  completedUserCount: number;
  bookmarkCount: number;
};

// TODO: review
export type AppCourse = {
  id: number;
  name: string;
  summary: string;
  content: string;
  isAssigned: boolean;
};

// TODO: review
export type DashboardCourses = {
  assignedCourses: AppCourse[];
  bookmarkedCourses: AppCourse[];
  completedCourses: AppCourse[];
};

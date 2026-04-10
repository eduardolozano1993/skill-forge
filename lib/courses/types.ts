export type AppCourse = {
  id: number;
  title: string;
  summary: string;
  content: string;
  isAssigned: boolean;
};

export type DashboardCourses = {
  assignedCourses: AppCourse[];
  bookmarkedCourses: AppCourse[];
  completedCourses: AppCourse[];
};

export type CourseDetail = {
  id: number;
  name: string;
  summary: string;
  content: string;
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

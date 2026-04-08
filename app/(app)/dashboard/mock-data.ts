export type DashboardCourse = {
  id: string;
  title: string;
  summary: string;
  dueDateLabel: string;
};

export type DashboardActivity = {
  id: string;
  title: string;
  message: string;
  meta: string;
};

export const assignedCourses: DashboardCourse[] = [
  {
    id: "assigned-api-foundations",
    title: "API Foundations",
    summary:
      "Compact preview for assigned coursework with room for title, state, and one-line context.",
    dueDateLabel: "Apr 18",
  },
  {
    id: "assigned-react-systems",
    title: "React Systems",
    summary:
      "Use this card size for dense dashboard collections without pushing content below the fold.",
    dueDateLabel: "Apr 22",
  },
  {
    id: "assigned-data-modeling",
    title: "Data Modeling",
    summary:
      "The mock lives here only so you can delete this file once the database is wired in.",
    dueDateLabel: "Apr 25",
  },
  {
    id: "assigned-testing-workflows",
    title: "Testing Workflows",
    summary:
      "A fourth card confirms the grid can hold four items per row on larger screens.",
    dueDateLabel: "Apr 29",
  },
];

export const recommendedCourses: DashboardCourse[] = [
  {
    id: "recommended-observability",
    title: "Observability",
    summary:
      "Recommended cards reuse the same compact component so the dashboard stays consistent.",
    dueDateLabel: "May 2",
  },
  {
    id: "recommended-leadership",
    title: "Leadership",
    summary:
      "This section can later swap to personalized recommendations without changing the list UI.",
    dueDateLabel: "May 6",
  },
  {
    id: "recommended-ai-evals",
    title: "AI Evals",
    summary:
      "The content is intentionally short so you can judge the visual density of the card.",
    dueDateLabel: "May 9",
  },
  {
    id: "recommended-system-design",
    title: "System Design",
    summary:
      "The stable id is intended to become the database key once this section is connected.",
    dueDateLabel: "May 13",
  },
];

export const recentActivity: DashboardActivity[] = [
  {
    id: "activity-course-ready",
    title: "Assigned course ready",
    meta: "Recent activity",
    message:
      "Your course list item can render this as a lightweight status update or action reminder.",
  },
  {
    id: "activity-recommendation-refresh",
    title: "Recommendations refreshed",
    meta: "Recent activity",
    message:
      "This row is sized for short activity messages without turning the section into a full feed.",
  },
  {
    id: "activity-progress-sync",
    title: "Progress synced",
    meta: "Recent activity",
    message:
      "Loading and empty states should remain clear even when this list eventually becomes dynamic.",
  },
  {
    id: "activity-notification-shell",
    title: "Notification shell ready",
    meta: "Recent activity",
    message:
      "The message is placeholder-only and can be removed with the rest of this mock file later.",
  },
];

const dashboardMockDelayMs = 750;

async function delayDashboardMockData() {
  await new Promise((resolve) => setTimeout(resolve, dashboardMockDelayMs));
}

export async function getAssignedCourses() {
  await delayDashboardMockData();

  return assignedCourses;
}

export async function getRecommendedCourses() {
  await delayDashboardMockData();

  return recommendedCourses;
}

export async function getBookmarkedCourses(): Promise<DashboardCourse[]> {
  await delayDashboardMockData();

  return [];
}

export async function getRecentActivity() {
  await delayDashboardMockData();

  return recentActivity;
}

export async function getDashboardMockData() {
  await delayDashboardMockData();

  return {
    assignedCourses,
    recommendedCourses,
    recentActivity,
  };
}

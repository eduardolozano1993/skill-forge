import type { MockCourse } from "@/lib/mock-courses";

export type DashboardCourse = MockCourse;

export type DashboardActivity = {
  id: string;
  title: string;
  message: string;
  meta: string;
};

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

export async function getRecentActivity() {
  await delayDashboardMockData();

  return recentActivity;
}

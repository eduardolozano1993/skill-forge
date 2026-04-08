import {
  NotificationItem,
  NotificationItemSkeleton,
} from "@/components/dashboard/notification-item";
import { DashboardListLayout } from "@/components/dashboard/dashboard-list-layout";
import type { DashboardActivity } from "@/app/(app)/dashboard/mock-data";

type ActivityListProps = {
  items: DashboardActivity[];
  isLoading?: boolean;
};

export function ActivityList({ items, isLoading = false }: ActivityListProps) {
  if (isLoading) {
    return (
      <DashboardListLayout variant="activity-stack">
        {Array.from({ length: 4 }, (_, index) => (
          <NotificationItemSkeleton key={`activity-skeleton-${index}`} />
        ))}
      </DashboardListLayout>
    );
  }

  return (
    <DashboardListLayout variant="activity-stack">
      {items.map((item) => (
        <NotificationItem key={item.id} {...item} />
      ))}
    </DashboardListLayout>
  );
}

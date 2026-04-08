import { NotificationItem } from "@/components/dashboard/notification-item";
import type { DashboardActivity } from "@/app/(app)/dashboard/mock-data";

type ActivityListProps = {
  items: DashboardActivity[];
  isLoading?: boolean;
};

export function ActivityList({ items, isLoading = false }: ActivityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-sm">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={`activity-skeleton-${index}`}
            className="h-24 animate-pulse rounded-lg border border-border bg-surface-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-sm">
      {items.map((item) => (
        <NotificationItem key={item.id} {...item} />
      ))}
    </div>
  );
}

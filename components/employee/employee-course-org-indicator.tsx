"use client";

import { Building2 } from "lucide-react";

type EmployeeCourseOrgIndicatorProps = {
  courseTitle: string;
};

export function EmployeeCourseOrgIndicator({
  courseTitle,
}: EmployeeCourseOrgIndicatorProps) {
  return (
    <span
      aria-label={`${courseTitle} is assigned to your organization`}
      title="Assigned to your organization"
      className="rounded-full p-2 text-brand"
    >
      <Building2 className="size-5" />
    </span>
  );
}

"use client";

import { Building2 } from "lucide-react";

type EmployeeCourseOrgIndicatorProps = {
  courseName: string;
};

export function EmployeeCourseOrgIndicator({
  courseName,
}: EmployeeCourseOrgIndicatorProps) {
  return (
    <span
      aria-label={`${courseName} is assigned to your organization`}
      title="Assigned to your organization"
      className="rounded-full p-2 text-brand"
    >
      <Building2 className="size-5" />
    </span>
  );
}

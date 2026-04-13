import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminOrganizationStatusAction } from "@/components/admin/admin-organization-status-action";
import { AdminUserStatusAction } from "@/components/admin/admin-user-status-action";
import type {
  AdminCourseRow,
  AdminOrganizationRow,
  AdminUserRow,
} from "@/lib/admin/types";

type AdminUsersTableProps = {
  rows: AdminUserRow[];
};

type AdminOrganizationsTableProps = {
  rows: AdminOrganizationRow[];
};

type AdminCoursesTableProps = {
  rows: AdminCourseRow[];
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function getUserStatusPillClasses(status: AdminUserRow["status"]) {
  return status === "ACTIVE"
    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border border-red-200 bg-red-50 text-red-700";
}

function getUserStatusLabel(status: AdminUserRow["status"]) {
  return status === "ACTIVE" ? "Active" : "Deactivated";
}

function getOrganizationStatusPillClasses(status: AdminOrganizationRow["status"]) {
  return status === "ACTIVE"
    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border border-red-200 bg-red-50 text-red-700";
}

function getOrganizationStatusLabel(status: AdminOrganizationRow["status"]) {
  return status === "ACTIVE" ? "Active" : "Deactivated";
}

export function AdminUsersTable({ rows }: AdminUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="space-y-2xs">
                <p className="font-medium text-text-strong">{user.displayName}</p>
                <p className="text-sm text-text-soft">{user.email}</p>
              </div>
            </TableCell>
            <TableCell className="text-text-soft">{user.userType}</TableCell>
            <TableCell className="text-text-soft">
              {user.organizationName ?? "Unassigned"}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getUserStatusPillClasses(user.status)}`}
              >
                {getUserStatusLabel(user.status)}
              </span>
            </TableCell>
            <TableCell className="text-text-soft">
              {formatDate(user.createdAt)}
            </TableCell>
            <TableCell>
              <AdminUserStatusAction
                userId={user.id}
                displayName={user.displayName}
                status={user.status}
                userType={user.userType}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function AdminOrganizationsTable({
  rows,
}: AdminOrganizationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Assigned courses</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((organization) => (
          <TableRow key={organization.id}>
            <TableCell>
              <div className="space-y-2xs">
                <p className="font-medium text-text-strong">{organization.name}</p>
                <p className="text-sm text-text-soft">
                  Created {formatDate(organization.createdAt)}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2xs">
                <p className="font-medium text-text-strong">
                  {organization.ownerDisplayName}
                </p>
                <p className="text-sm text-text-soft">{organization.ownerEmail}</p>
              </div>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrganizationStatusPillClasses(organization.status)}`}
              >
                {getOrganizationStatusLabel(organization.status)}
              </span>
            </TableCell>
            <TableCell className="text-text-soft">
              {organization.memberCount}
            </TableCell>
            <TableCell className="text-text-soft">
              {organization.assignedCourseCount}
            </TableCell>
            <TableCell>
              <AdminOrganizationStatusAction
                organizationId={organization.id}
                name={organization.name}
                status={organization.status}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function AdminCoursesTable({ rows }: AdminCoursesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Assigned orgs</TableHead>
          <TableHead>Completions</TableHead>
          <TableHead>Bookmarks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((course) => (
          <TableRow key={course.id}>
            <TableCell>
              <div className="space-y-2xs">
                <p className="font-medium text-text-strong">{course.title}</p>
                <p className="text-sm text-text-soft">{course.summary}</p>
              </div>
            </TableCell>
            <TableCell className="text-text-soft">
              {course.assignedOrganizationCount}
            </TableCell>
            <TableCell className="text-text-soft">
              {course.completedUserCount}
            </TableCell>
            <TableCell className="text-text-soft">{course.bookmarkCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

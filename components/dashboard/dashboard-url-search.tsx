"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CourseSearchInput } from "@/components/dashboard/course-search-input";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";

type DashboardUrlSearchProps = {
  query: string;
};

export function DashboardUrlSearch({ query }: DashboardUrlSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  function handleChange(nextValue: string) {
    setValue(nextValue);

    const params = new URLSearchParams(searchParams.toString());

    if (nextValue.trim()) {
      params.set("q", nextValue);
    } else {
      params.delete("q");
    }

    const nextQueryString = params.toString();
    const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  return (
    <DashboardSection aria-busy={isPending}>
      <DashboardSectionHeader
        title="Course search"
        description="Filter assigned courses by title or summary."
      />
      <DashboardSectionBody>
        <CourseSearchInput
          label="Search assigned courses"
          placeholder="Search assigned courses"
          value={value}
          onChange={handleChange}
        />
      </DashboardSectionBody>
    </DashboardSection>
  );
}

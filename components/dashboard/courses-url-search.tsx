"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CourseSearchInput } from "@/components/dashboard/course-search-input";

type CoursesUrlSearchProps = {
  query: string;
};

export function CoursesUrlSearch({ query }: CoursesUrlSearchProps) {
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

    params.delete("page");

    const nextQueryString = params.toString();
    const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  return (
    <div aria-busy={isPending}>
      <CourseSearchInput
        label="Search courses"
        placeholder="Search courses by title or summary"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

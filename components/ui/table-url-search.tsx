"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

type TableUrlSearchProps = {
  label: string;
  placeholder: string;
  paramName: string;
  query: string;
  resetParams?: string[];
};

export function TableUrlSearch({
  label,
  placeholder,
  paramName,
  query,
  resetParams = [],
}: TableUrlSearchProps) {
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
      params.set(paramName, nextValue);
    } else {
      params.delete(paramName);
    }

    for (const resetParam of resetParams) {
      params.delete(resetParam);
    }

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  return (
    <label className="block" aria-busy={isPending}>
      <span className="sr-only">{label}</span>
      <Input
        type="search"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

type AdminUrlSearchProps = {
  label: string;
  placeholder: string;
  paramName: string;
  query: string;
};

export function AdminUrlSearch({
  label,
  placeholder,
  paramName,
  query,
}: AdminUrlSearchProps) {
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

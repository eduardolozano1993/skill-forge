"use client";

import { useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

const TABLE_SEARCH_DEBOUNCE_MS = 250;

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
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    if (
      document.activeElement === inputRef.current &&
      inputRef.current.value !== query
    ) {
      return;
    }

    inputRef.current.value = query;
  }, [query]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  function handleChange(nextValue: string) {
    if (debounceTimeoutRef.current !== null) {
      window.clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
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
    }, TABLE_SEARCH_DEBOUNCE_MS);
  }

  return (
    <label className="block" aria-busy={isPending}>
      <span className="sr-only">{label}</span>
      <Input
        ref={inputRef}
        type="search"
        defaultValue={query}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

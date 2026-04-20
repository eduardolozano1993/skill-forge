import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/tailwind/tailwind";
import { buttonVariants } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pathname: string;
  searchParams?: Record<string, string | undefined>;
  className?: string;
};

function buildPageHref(
  pathname: string,
  searchParams: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value);
    }
  }

  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 0) {
    return [];
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((left, right) => left - right);
}

export function Pagination({
  currentPage,
  totalPages,
  pathname,
  searchParams = {},
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col gap-sm md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <p className="text-sm text-text-soft">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          aria-disabled={currentPage === 1}
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            }),
            currentPage === 1 && "pointer-events-none opacity-50",
          )}
          href={buildPageHref(pathname, searchParams, currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>

        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const showEllipsis =
            typeof previousPage === "number" && page - previousPage > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis ? (
                <span className="px-1 text-sm text-text-soft">...</span>
              ) : null}
              <Link
                aria-current={page === currentPage ? "page" : undefined}
                className={buttonVariants({
                  variant: page === currentPage ? "default" : "outline",
                  size: "sm",
                })}
                href={buildPageHref(pathname, searchParams, page)}
              >
                {page}
              </Link>
            </div>
          );
        })}

        <Link
          aria-disabled={currentPage === totalPages}
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            }),
            currentPage === totalPages && "pointer-events-none opacity-50",
          )}
          href={buildPageHref(pathname, searchParams, currentPage + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </nav>
  );
}

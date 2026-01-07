import * as React from "react";
import { cn } from "@/lib/utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];

    // If total pages <= 4, show all
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const prevPage = page - 1;
    const nextPage = page + 1;
    const endPage = totalPages;

    // Always show first page (1)
    pages.push(1);

    // Handle middle part: prev, current, next
    if (page === 1) {
      // Page 1: 1, 2, ..., end
      if (nextPage <= endPage) {
        pages.push(nextPage);
      }
      if (nextPage < endPage - 1) {
        pages.push("...");
      }
      // Add last page
      if (endPage > 1) {
        pages.push(endPage);
      }
    } else if (page === endPage) {
      // Last page: 1, ..., prev, end
      if (prevPage > 2) {
        pages.push("...");
      } else if (prevPage === 2) {
        pages.push(2);
      }
      if (prevPage > 1) {
        pages.push(prevPage);
      }
      // Add last page
      pages.push(endPage);
    } else {
      // Middle page: 1, ..., prev, current, next, ..., end
      if (prevPage > 2) {
        pages.push("...");
      } else if (prevPage === 2) {
        pages.push(2);
      }
      // Only add prev if it's not 1 (since 1 is already there)
      if (prevPage > 1) {
        pages.push(prevPage);
      }
      // Add current page
      pages.push(page);
      // Add next page
      if (nextPage < endPage) {
        pages.push(nextPage);
      }
      // Add "..." if there's a gap
      if (nextPage < endPage - 1) {
        pages.push("...");
      }
      // Add last page
      if (endPage > page) {
        pages.push(endPage);
      }
    }

    return pages;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination navigation"
      className={cn("flex justify-center py-4", className)}
      {...props}
    >
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            className="px-3 py-2 ml-0 leading-tight text-gray-800 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-800"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
        </li>
        {getPages().map((p, index) => (
          <li key={typeof p === "number" ? p : `ellipsis-${index}`}>
            {p === "..." ? (
              <span className="px-3 py-2 leading-tight text-gray-800 bg-white border border-gray-300">
                ...
              </span>
            ) : (
              <button
                className={cn(
                  "px-3 py-2 leading-tight border border-gray-300",
                  p === page
                    ? "bg-mainTextHoverV1 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                )}
                onClick={() => onPageChange(p as number)}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            className="px-3 py-2 leading-tight text-gray-800 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-800"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

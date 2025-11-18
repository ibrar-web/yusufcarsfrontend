import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/components/ui/utils";

type PaginationControlsProps = {
  page: number;
  pageSize: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
};

function buildPages(current: number, totalPages: number, maxSlots = 7) {
  if (totalPages <= 1) return [1];

  const pages: (number | "ellipsis")[] = [];
  const half = Math.floor((maxSlots - 3) / 2);
  const start = Math.max(2, current - half);
  const end = Math.min(totalPages - 1, current + half);

  pages.push(1);

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function TablePagination({
  page,
  pageSize,
  totalItems = 0,
  pageSizeOptions = [20, 50, 100],
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1);
  const pages = buildPages(page, totalPages);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange?.(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="hidden sm:inline">
          {totalItems ? `of ${totalItems.toLocaleString()}` : ""}
        </span>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={!hasPrev}
              tabIndex={hasPrev ? 0 : -1}
              onClick={(event) => {
                event.preventDefault();
                if (hasPrev) onPageChange(page - 1);
              }}
            />
          </PaginationItem>
          {pages.map((entry, index) =>
            entry === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationLink
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (entry !== page) onPageChange(entry);
                  }}
                  isActive={entry === page}
                >
                  {entry}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!hasNext}
              tabIndex={hasNext ? 0 : -1}
              onClick={(event) => {
                event.preventDefault();
                if (hasNext) onPageChange(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

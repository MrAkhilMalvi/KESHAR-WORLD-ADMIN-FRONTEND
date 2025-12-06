import { PAGE_SIZES } from "../../constants/reportTables";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface PaginationType {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

interface PaginationProps {
  pagination: PaginationType;
  handlePagination: (value: "next" | "prev") => void;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
}

export const Pagination = ({
  pagination,
  handlePagination,
  setPagination,
}: PaginationProps) => {
  const goToFirst = () =>
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  const goToLast = () =>
    setPagination((prev) => ({ ...prev, currentPage: prev.totalPages }));

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Page Info */}
      <span className="text-sm dark:text-white text-gray-600">
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>

      {/* Pagination Buttons */}
      <div className="flex gap-2">
        {/* First Page */}
        <button
          disabled={pagination.currentPage === 1}
          onClick={goToFirst}
          className="leading-none pb-1 px-3 py-0 text-3xl bg-secondary hover:bg-secondary-dark text-white rounded-md disabled:opacity-50 flex items-center justify-center"
        >
          «
        </button>

        {/* Prev */}
        <button
          disabled={pagination.currentPage === 1}
          onClick={() => handlePagination("prev")}
          className="leading-none pb-1 px-3 py-0 text-3xl bg-secondary hover:bg-secondary-dark text-white rounded-md disabled:opacity-50 flex items-center justify-center"
        >
          ‹
        </button>

        {/* Next */}
        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => handlePagination("next")}
          className="leading-none pb-1 px-3 py-0 text-3xl bg-secondary hover:bg-secondary-dark text-white rounded-md disabled:opacity-50 flex items-center justify-center"
        >
          ›
        </button>

        {/* Last Page */}
        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={goToLast}
          className="leading-none pb-1 px-3 py-0 text-3xl bg-secondary hover:bg-secondary-dark text-white rounded-md disabled:opacity-50 flex items-center justify-center"
        >
          »
        </button>
      </div>

      {/* Page Size Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm dark:text-white text-gray-600">
          Page Size
        </label>
        <Select
          value={pagination.pageSize.toString()} // ✅ controlled value
          onValueChange={(value) =>
            setPagination({ ...pagination, pageSize: Number(value), currentPage: 1 })
          }
        >
          <SelectTrigger className="w-15">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent className="p-0">
            {PAGE_SIZES.map((item) => (
              <SelectItem key={item} value={item.toString()}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm dark:text-white text-gray-600 text-center">
          Record {(pagination.currentPage - 1) * pagination.pageSize + 1} -{" "}
          {Math.min(
            pagination.currentPage * pagination.pageSize,
            pagination.totalCount
          )}{" "}
          of {pagination.totalCount}
        </span>
      </div>
    </div>
  );
};

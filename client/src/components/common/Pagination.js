import React from "react";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from "react-icons/bi";

const pageSizeOptions = [5, 10, 20, 50, 100];

function Pagination({ pagination, onPageChange, onPageSizeChange }) {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange(newSize);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-md border border-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 hover:text-primary-500 transition-colors"
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
        >
          <BiChevronsLeft className="h-5 w-5" />
        </button>
        <button
          className="p-2 rounded-md border border-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 hover:text-primary-500 transition-colors"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          <BiChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-1">
          {renderPageNumbers().map((number) => (
            <button
              key={number}
              className={`px-3 py-1 rounded-md border ${
                currentPage === number
                  ? "bg-primary-500 text-white border-primary-500"
                  : "border-secondary-200 hover:border-primary-500 hover:text-primary-500"
              } transition-colors`}
              onClick={() => onPageChange(number)}
            >
              {number + 1}
            </button>
          ))}
        </div>

        <button
          className="p-2 rounded-md border border-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 hover:text-primary-500 transition-colors"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          <BiChevronRight className="h-5 w-5" />
        </button>
        <button
          className="p-2 rounded-md border border-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 hover:text-primary-500 transition-colors"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
        >
          <BiChevronsRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-secondary-600">
        <span>
          Page {currentPage + 1} of {totalPages} ({totalItems} items)
        </span>
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            className="rounded-md border-secondary-200 py-1 pl-2 pr-8 focus:border-primary-500 focus:ring-primary-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Pagination;

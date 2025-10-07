import React from "react";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  if (totalPages === 0) return null;

  return (
    <div className="flex justify-between items-center mt-4">
      {/* Left: Items per page */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-700 text-sm">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Page numbers */}
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 border rounded hover:bg-gray-100"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MoveLeftIcon className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded hover:bg-gray-100 ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          className="px-2 py-1 border rounded hover:bg-gray-100"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <MoveRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

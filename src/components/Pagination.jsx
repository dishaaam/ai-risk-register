const Pagination = ({ currentPage, totalPages, totalElements, pageSize, onPageChange }) => {
  const startRecord = currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 text-sm text-gray-600">
      {/* Record count */}
      <span>
        Showing {totalElements === 0 ? 0 : startRecord}–{endRecord} of {totalElements} records
      </span>

      {/* Page buttons */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>

        {/* Page numbers */}
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 border rounded transition ${
              i === currentPage
                ? "bg-blue-900 text-white border-blue-900"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
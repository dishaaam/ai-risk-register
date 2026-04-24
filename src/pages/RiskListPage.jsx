import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRisks, deleteRisk } from "../services/riskService";
import TableSkeleton from "../components/TableSkeleton";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import Pagination from "../components/Pagination";
import SortIcon from "../components/SortIcon";
import ConfirmModal from "../components/ConfirmModal";

const COLUMNS = [
  { label: "Title", key: "title" },
  { label: "Category", key: "category" },
  { label: "Status", key: "status" },
  { label: "Priority", key: "priority" },
  { label: "Score", key: "score" },
  { label: "Owner", key: "owner" },
  { label: "Created", key: "createdDate" },
];

const RiskListPage = () => {
  const navigate = useNavigate();

  // Data state
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10;

  // Sorting state
  const [sortBy, setSortBy] = useState("createdDate");
  const [sortDir, setSortDir] = useState("desc");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch data
  const fetchRisks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRisks(currentPage, PAGE_SIZE, sortBy, sortDir);
      setRisks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError("Failed to load risks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, sortDir]);

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  // Handle column sort click
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
    setCurrentPage(0);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await deleteRisk(deleteTarget.id);
      setDeleteTarget(null);
      fetchRisks();
    } catch (err) {
      setError("Failed to delete risk.");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Risk Register</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalElements} total risks tracked
          </p>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          + Add Risk
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={fetchRisks} className="underline font-medium">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white text-xs uppercase">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 cursor-pointer hover:bg-blue-800 select-none transition"
                >
                  {col.label}
                  <SortIcon column={col.key} sortBy={sortBy} sortDir={sortDir} />
                </th>
              ))}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <TableSkeleton />
                </td>
              </tr>
            ) : risks.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-5xl">📋</span>
                    <p className="text-lg font-medium">No risks found</p>
                    <p className="text-sm">
                      Click "+ Add Risk" to create your first entry
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              risks.map((risk) => (
                <tr
                  key={risk.id}
                  className="border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer"
                  onClick={() => navigate(`/risks/${risk.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">
                    {risk.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{risk.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={risk.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={risk.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${
                        risk.score >= 70
                          ? "text-red-600"
                          : risk.score >= 50
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {risk.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{risk.owner}</td>
                  <td className="px-4 py-3 text-gray-500">{risk.createdDate}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/risks/${risk.id}/edit`);
                      }}
                      className="text-blue-600 hover:underline text-xs mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(risk);
                      }}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && totalElements > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default RiskListPage;
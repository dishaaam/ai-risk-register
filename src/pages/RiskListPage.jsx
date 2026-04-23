import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockRisks } from "../services/mockData";
import TableSkeleton from "../components/TableSkeleton";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

const RiskListPage = ({ risks = [] }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Risk Register</h1>
        <button
          onClick={() => navigate("/create")}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          + Add Risk
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Created</th>
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
              // Empty state
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-5xl">📋</span>
                    <p className="text-lg font-medium">No risks found</p>
                    <p className="text-sm">Click "+ Add Risk" to create your first entry</p>
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
                    <span className={`font-bold ${risk.score >= 70 ? "text-red-600" : risk.score >= 50 ? "text-yellow-600" : "text-green-600"}`}>
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
                      className="text-blue-600 hover:underline text-xs mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Delete risk: ${risk.title}`);
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

        {/* Pagination placeholder */}
        {!loading && risks.length > 0 && (
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 text-sm text-gray-600">
            <span>Showing {risks.length} records</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskListPage;
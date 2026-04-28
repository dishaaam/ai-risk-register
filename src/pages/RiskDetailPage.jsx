import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRiskById, deleteRisk } from "../services/riskService";
import { useAuth } from "../context/AuthContext";
import DetailSkeleton from "../components/DetailSkeleton";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import ScoreMeter from "../components/ScoreMeter";
import InfoField from "../components/InfoField";
import ConfirmModal from "../components/ConfirmModal";
import AiAnalysisCard from "../components/AiAnalysisCard";

const RiskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canEdit = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const data = await getRiskById(id);
        if (!data) {
          setError("Risk not found.");
        } else {
          setRisk(data);
        }
      } catch (err) {
        setError("Failed to load risk details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRisk();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteRisk(id);
      navigate("/risks");
    } catch (err) {
      setError("Failed to delete risk.");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={() => navigate("/risks")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Risk List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate("/risks")}
        className="text-blue-900 hover:underline text-sm mb-6 flex items-center gap-1"
      >
        ← Back to Risk List
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-start gap-4">

          {/* Title and Badges */}
          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-xl font-bold text-gray-800 leading-snug">
              {risk.title}
            </h1>
            <div className="flex flex-wrap gap-2 items-center">
              <StatusBadge status={risk.status} />
              <PriorityBadge priority={risk.priority} />
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                📁 {risk.category}
              </span>
              <span className="text-xs text-gray-400">
                ID: #{risk.id}
              </span>
            </div>
          </div>

          {/* Action Buttons — only ADMIN and MANAGER */}
          {canEdit && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => navigate(`/risks/${id}/edit`)}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm flex items-center gap-1"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm flex items-center gap-1"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Risk Score Card */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
          Risk Score
        </h2>
        <ScoreMeter score={risk.score} />
      </div>

      {/* Details Grid */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-5 uppercase tracking-wide">
          Risk Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoField label="Risk Owner" value={risk.owner} />
          <InfoField label="Category" value={risk.category} />
          <InfoField label="Status">
            <StatusBadge status={risk.status} />
          </InfoField>
          <InfoField label="Priority">
            <PriorityBadge priority={risk.priority} />
          </InfoField>
          <InfoField
            label="Created Date"
            value={risk.createdDate
              ? new Date(risk.createdDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          />
          <InfoField
            label="Last Updated"
            value={risk.updatedDate
              ? new Date(risk.updatedDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          />
        </div>

        {/* Description */}
        {risk.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <InfoField label="Description">
              <p className="text-sm text-gray-700 leading-relaxed mt-1">
                {risk.description}
              </p>
            </InfoField>
          </div>
        )}
      </div>

      {/* Audit Info */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
          Audit Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>Created: <strong>{risk.createdDate || "—"}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>Owner: <strong>{risk.owner || "—"}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏷️</span>
            <span>ID: <strong>#{risk.id}</strong></span>
          </div>
        </div>
      </div>

      {/* AI Analysis Card */}
      <AiAnalysisCard riskId={id} />

      {/* Delete Modal */}
      {showDeleteModal && (
        <ConfirmModal
          message={`Are you sure you want to delete "${risk.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default RiskDetailPage;
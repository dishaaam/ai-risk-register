import { useState } from "react";
import { generateReport } from "../services/aiService";
import { mockRisks } from "../services/mockData";

const AiReportModal = ({ onClose }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await generateReport(mockRisks);
      setReport(data);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-lg font-bold text-gray-800">
              AI Executive Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Initial state */}
          {!report && !loading && (
            <div className="flex flex-col items-center py-8 gap-4">
              <span className="text-6xl">📋</span>
              <h3 className="text-lg font-bold text-gray-800">
                Generate AI Report
              </h3>
              <p className="text-gray-500 text-sm text-center max-w-sm">
                The AI will analyse all your registered risks and generate a
                professional executive report with summary, insights, and
                recommendations.
              </p>
              <button
                onClick={handleGenerate}
                className="bg-blue-900 text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 transition font-medium"
              >
                🚀 Generate Report
              </button>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm flex justify-between w-full">
                  <span>{error}</span>
                  <button
                    onClick={handleGenerate}
                    className="underline font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              <p className="text-gray-600 font-medium">
                AI is generating your report...
              </p>
              <div className="flex flex-col gap-1 text-center">
                <p className="text-gray-400 text-xs">Analysing all risks</p>
                <p className="text-gray-400 text-xs">Identifying patterns</p>
                <p className="text-gray-400 text-xs">
                  Writing recommendations
                </p>
              </div>
            </div>
          )}

          {/* Report Content */}
          {report && !loading && (
            <div className="flex flex-col gap-5">

              {/* Report Title */}
              <div className="text-center pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">
                  {report.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Generated:{" "}
                  {new Date(report.generated_at).toLocaleString()} • Model:{" "}
                  {report.model_used}
                </p>
              </div>

              {/* Executive Summary */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                  Executive Summary
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {report.executive_summary}
                </p>
              </div>

              {/* Overview */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-2">
                  📊 Overview
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {report.overview}
                </p>
              </div>

              {/* Top Risk Items */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-3">
                  🔴 Top Risk Items
                </p>
                <div className="flex flex-col gap-2">
                  {report.top_items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5"
                    >
                      <span className="text-red-500 font-bold text-sm flex-shrink-0">
                        {i + 1}.
                      </span>
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-3">
                  💡 AI Recommendations
                </p>
                <div className="flex flex-col gap-2">
                  {report.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2.5"
                    >
                      <span className="text-green-600 font-bold text-sm flex-shrink-0">
                        ✓
                      </span>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regenerate */}
              <button
                onClick={handleGenerate}
                className="text-sm text-blue-700 hover:underline self-start"
              >
                🔄 Regenerate Report
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center flex-shrink-0">
          <p className="text-xs text-gray-400">
            Powered by LLaMA-3.3-70b via Groq
          </p>
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiReportModal;
import { useState } from "react";
import { downloadCSV, downloadJSON } from "../services/exportService";

const ExportButton = ({ risks }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type) => {
    setExporting(true);
    setShowMenu(false);
    try {
      // Small delay so user sees feedback
      await new Promise((res) => setTimeout(res, 400));
      if (type === "csv") downloadCSV(risks);
      if (type === "json") downloadJSON(risks);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        disabled={exporting}
        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50"
      >
        {exporting ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <span>⬇️</span>
        )}
        {exporting ? "Exporting..." : "Export"}
        {!exporting && <span className="text-gray-400">▾</span>}
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
            <button
              onClick={() => handleExport("csv")}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>📄</span>
              <div>
                <p className="font-medium">CSV File</p>
                <p className="text-xs text-gray-400">For Excel / Sheets</p>
              </div>
            </button>
            <button
              onClick={() => handleExport("json")}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>📋</span>
              <div>
                <p className="font-medium">JSON File</p>
                <p className="text-xs text-gray-400">For developers</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
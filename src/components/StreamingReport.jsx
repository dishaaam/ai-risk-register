import { useState, useEffect, useRef } from "react";

// Simulates SSE streaming by revealing text word by word
const useStreamingText = (fullText, isStreaming) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isStreaming || !fullText) return;
    setDisplayedText("");
    indexRef.current = 0;

    const words = fullText.split(" ");
    const interval = setInterval(() => {
      if (indexRef.current < words.length) {
        setDisplayedText((prev) =>
          prev ? prev + " " + words[indexRef.current] : words[indexRef.current]
        );
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [fullText, isStreaming]);

  return displayedText;
};

const StreamingReport = ({ report, isStreaming }) => {
  const summaryText = useStreamingText(
    report?.executive_summary,
    isStreaming
  );
  const overviewText = useStreamingText(report?.overview, isStreaming);

  if (!report) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">

      {/* Report Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{report.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Generated: {new Date(report.generated_at).toLocaleString()} •
            Model: {report.model_used}
          </p>
        </div>
        {isStreaming && (
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>Streaming...</span>
          </div>
        )}
      </div>

      {/* Executive Summary */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
          Executive Summary
        </h3>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {isStreaming ? summaryText : report.executive_summary}
            {isStreaming && summaryText.length < report.executive_summary?.length && (
              <span className="inline-block w-1 h-4 bg-blue-600 ml-1 animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
          Overview
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {isStreaming ? overviewText : report.overview}
          {isStreaming && overviewText.length < report.overview?.length && (
            <span className="inline-block w-1 h-4 bg-blue-600 ml-1 animate-pulse align-middle" />
          )}
        </p>
      </div>

      {/* Top Risk Items */}
      {report.top_items && (
        <div className="mb-5">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
            Top Risk Items
          </h3>
          <div className="flex flex-col gap-2">
            {report.top_items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3"
              >
                <span className="text-red-500 font-bold text-sm flex-shrink-0">
                  {i + 1}.
                </span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
            AI Recommendations
          </h3>
          <div className="flex flex-col gap-2">
            {report.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-lg px-4 py-3"
              >
                <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingReport;
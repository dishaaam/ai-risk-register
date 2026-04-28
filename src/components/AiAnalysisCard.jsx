import { useState } from "react";
import { getAiAnalysis, askAiQuestion } from "../services/riskService";

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const AiAnalysisCard = ({ riskId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [askLoading, setAskLoading] = useState(false);

  const handleAnalyse = async () => {
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      const data = await getAiAnalysis(riskId);
      if (!data) throw new Error("No data returned");
      setAnalysis(data);
    } catch (err) {
      console.error("AI analysis error:", err);
      setError("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAi = async () => {
    if (!question.trim()) return;
    setAskLoading(true);
    setAnswer(null);
    try {
      const data = await askAiQuestion(riskId, question);
      setAnswer(data);
    } catch (err) {
      console.error("Ask AI error:", err);
      setAnswer({
        answer: "Failed to get a response. Please try again.",
        confidence: null,
      });
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🤖</span>
        <h2 className="text-base font-bold text-gray-800">AI Analysis</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium ml-auto">
          Powered by LLaMA-3.3-70b
        </span>
      </div>

      {/* Initial State — no analysis yet */}
      {!analysis && !loading && (
        <div className="flex flex-col items-center py-6 gap-3">
          <span className="text-4xl">🧠</span>
          <p className="text-gray-500 text-sm text-center max-w-sm">
            Click below to get an AI-powered analysis of this risk
            including description and actionable recommendations.
          </p>
          <button
            onClick={handleAnalyse}
            className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition text-sm font-medium"
          >
            🔍 Analyse with AI
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
          <p className="text-gray-500 text-sm">AI is analysing this risk...</p>
          <p className="text-gray-400 text-xs">This may take a few seconds</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm flex justify-between items-center mt-2">
          <span>{error}</span>
          <button
            onClick={handleAnalyse}
            className="underline font-medium ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Analysis Result */}
      {analysis && !loading && (
        <div className="flex flex-col gap-5">

          {/* AI Description */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
              AI Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {analysis.description}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span>
              🎯 Confidence:{" "}
              <strong className="text-gray-700">
                {(analysis.confidence * 100).toFixed(0)}%
              </strong>
            </span>
            <span>
              🤖 Model:{" "}
              <strong className="text-gray-700">
                {analysis.model_used}
              </strong>
            </span>
            <span>
              🕐 Generated:{" "}
              <strong className="text-gray-700">
                {new Date(analysis.generated_at).toLocaleString()}
              </strong>
            </span>
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-sm font-bold text-gray-800 mb-3">
              💡 Recommendations
            </p>
            <div className="flex flex-col gap-3">
              {analysis.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg p-3 flex gap-3 items-start hover:bg-gray-50 transition"
                >
                  <span className="text-lg mt-0.5">
                    {index === 0 ? "🔴" : index === 1 ? "🟡" : "🟢"}
                  </span>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-700">
                        {rec.action_type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          priorityStyles[rec.priority] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Re-analyse */}
          <button
            onClick={handleAnalyse}
            className="text-sm text-blue-700 hover:underline self-start"
          >
            🔄 Re-analyse
          </button>

          <hr className="border-gray-100" />

          {/* Ask AI */}
          <div>
            <p className="text-sm font-bold text-gray-800 mb-3">
              💬 Ask AI about this Risk
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAi()}
                placeholder="e.g. What is the business impact of this risk?"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAskAi}
                disabled={askLoading || !question.trim()}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 min-w-[60px] justify-center"
              >
                {askLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  "Ask"
                )}
              </button>
            </div>

            {/* Answer */}
            {answer && (
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  AI Response
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {answer.answer}
                </p>
                {answer.confidence && (
                  <p className="text-xs text-gray-400 mt-2">
                    Confidence: {(answer.confidence * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAnalysisCard;
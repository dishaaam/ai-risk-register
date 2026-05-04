import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { getStats } from "../services/riskService";
import { generateReport } from "../services/aiService";
import { downloadCSV, downloadJSON } from "../services/exportService";
import { mockAnalyticsData, mockRisks } from "../services/mockData";
import StreamingReport from "../components/StreamingReport";
import ChartSkeleton from "../components/ChartSkeleton";
import CardSkeleton from "../components/CardSkeleton";
import ExportButton from "../components/ExportButton";

const COLORS = ["#1B4F8A", "#EF4444", "#EAB308", "#22C55E", "#8B5CF6", "#F97316"];
const STATUS_COLORS = { open: "#EF4444", inProgress: "#EAB308", resolved: "#22C55E" };

const PERIODS = ["Last 3 Months", "Last 6 Months", "All Time"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

  // Streaming report state
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportError("");
    setReport(null);
    setIsStreaming(false);
    try {
      const data = await generateReport(mockRisks);
      setReport(data);
      setIsStreaming(true);
      // Stop streaming indicator after text finishes
      setTimeout(() => setIsStreaming(false), 8000);
    } catch (err) {
      setReportError("Failed to generate report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  // Get trend data based on selected period
  const getTrendData = () => {
    const all = mockAnalyticsData.monthlyTrend;
    if (selectedPeriod === "Last 3 Months") return all.slice(-3);
    if (selectedPeriod === "Last 6 Months") return all.slice(-6);
    return all;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Deep dive into your risk data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton risks={mockRisks} />
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm"
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            {[
              { label: "Total Risks", value: stats.totalRisks, color: "text-blue-900", bg: "bg-blue-50" },
              { label: "Avg Score", value: stats.averageScore, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "High Priority", value: stats.highPriority, color: "text-red-600", bg: "bg-red-50" },
              { label: "Resolved", value: stats.resolvedRisks, color: "text-green-600", bg: "bg-green-50" },
            ].map((kpi, i) => (
              <div key={i} className={`${kpi.bg} rounded-xl p-4 flex flex-col gap-1`}>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {kpi.label}
                </span>
                <span className={`text-3xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-500 font-medium">Period:</span>
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedPeriod === p
                ? "bg-blue-900 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Area Chart — Monthly Trend by Status */}
        {loading ? <ChartSkeleton /> : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Monthly Risk Trend by Status
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              How risks have evolved across statuses over time
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={getTrendData()} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
                <Area type="monotone" dataKey="open" name="Open" stroke="#EF4444" fill="url(#openGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="inProgress" name="In Progress" stroke="#EAB308" fill="url(#progressGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22C55E" fill="url(#resolvedGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart — Score Distribution */}
        {loading ? <ChartSkeleton /> : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Risk Score Distribution
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              How risks are spread across score ranges
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockAnalyticsData.scoreDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Risks" radius={[4, 4, 0, 0]}>
                  {mockAnalyticsData.scoreDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Bar Chart — Top Owners */}
        {loading ? <ChartSkeleton /> : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Risks by Owner
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Number of risks assigned to each team member
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={mockAnalyticsData.topOwners}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="owner" type="category" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Risks" fill="#1B4F8A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart — Avg Resolution Time */}
        {loading ? <ChartSkeleton /> : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Avg Resolution Time by Category
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Average days to resolve risks per category
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mockAnalyticsData.resolutionTime} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgDays" name="Avg Days" radius={[4, 4, 0, 0]}>
                  {mockAnalyticsData.resolutionTime.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Pie Chart — By Category */}
        {loading ? <ChartSkeleton /> : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Risk Distribution by Category
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Proportional breakdown of risk categories
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.byCategory.filter((c) => c.count > 0)}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {stats.byCategory.filter((c) => c.count > 0).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Owner Avg Score Table */}
        {loading ? <ChartSkeleton /> : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Owner Performance Summary
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Average risk score per owner
            </p>
            <div className="flex flex-col gap-3">
              {mockAnalyticsData.topOwners.map((owner, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {owner.owner.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {owner.owner}
                      </span>
                      <span className={`text-xs font-bold ${
                        owner.avgScore >= 70 ? "text-red-600" :
                        owner.avgScore >= 50 ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {owner.avgScore}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          owner.avgScore >= 70 ? "bg-red-500" :
                          owner.avgScore >= 50 ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${owner.avgScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Streaming Report Section */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              🤖 AI Generated Report
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Generate a streaming AI report based on all current risk data
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {reportLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating...
              </>
            ) : (
              <>🚀 {report ? "Regenerate" : "Generate"} Report</>
            )}
          </button>
        </div>

        {/* Report Error */}
        {reportError && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
            {reportError}
          </div>
        )}

        {/* Loading state */}
        {reportLoading && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
            <p className="text-gray-500 text-sm">AI is analysing your risk data...</p>
          </div>
        )}

        {/* No report yet */}
        {!report && !reportLoading && !reportError && (
          <div className="flex flex-col items-center py-8 gap-3 text-gray-400">
            <span className="text-5xl">📊</span>
            <p className="text-sm">
              Click "Generate Report" to get an AI-powered executive summary
            </p>
          </div>
        )}
      </div>

      {/* Streaming Report Display */}
      <StreamingReport report={report} isStreaming={isStreaming} />

    </div>
  );
};

export default AnalyticsPage;